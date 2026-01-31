from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn
import uuid
import json
import os
import asyncio
from typing import Dict, List
from datetime import datetime

from config import Config
from models import ChatRequest, ChatResponse, ChatMessage, GenerateRequest, GenerationStatus, DetailedProject, Step, ProjectMaterial, MaterialReq
from rag_service import RAGService
from image_client import ImageClient
import httpx

app = FastAPI(title="AI Architect Backend")

# Inventory Helper
async def fetch_inventory() -> str:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{Config.INVENTORY_SERVICE_URL}/items")
            if response.status_code == 200:
                items = response.json()
                inventory_list = []
                for item in items:
                    inventory_list.append(f"- {item['type']}: {item['currentAmount']} {item['unit']} (Category: {item['category']})")
                
                if not inventory_list:
                    return "No materials currently available in inventory."
                    
                return "Available Materials:\n" + "\n".join(inventory_list)
            else:
                return "Could not fetch inventory data."
    except Exception as e:
        print(f"Inventory fetch error: {e}")
        return "Inventory service unavailable."

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
DATA_DIR = os.path.join(Config.BASE_DIR, "data", "projects")
os.makedirs(DATA_DIR, exist_ok=True)

# Static Files for Images
app.mount("/images", StaticFiles(directory=Config.GENERATED_IMAGES_DIR), name="images")

# Services
rag_service = RAGService()
image_client = ImageClient()

# State
active_generations: Dict[str, GenerationStatus] = {}

@app.on_event("startup")
async def startup_event():
    await background_startup()

async def background_startup():
    print("Executing Background Startup...")
    loop = asyncio.get_running_loop()
    tasks = [
        loop.run_in_executor(None, image_client.warmup),
        loop.run_in_executor(None, rag_service.initialize_index)
    ]
    await asyncio.gather(*tasks)
    print("Startup Complete.")

# --- Persistence Helpers ---

# ... (Persistence Helpers unchanged)

def save_project_to_disk(project: DetailedProject):
    file_path = os.path.join(DATA_DIR, f"{project.project_id}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(project.model_dump_json(indent=2))

def load_project_from_disk(project_id: str) -> DetailedProject:
    file_path = os.path.join(DATA_DIR, f"{project_id}.json")
    if not os.path.exists(file_path):
        return None
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        return DetailedProject(**data)

# --- Routes ---

@app.post("/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    user_msg = request.message
    project = request.project
    
    # Construct history context
    history = ""
    for msg in project.messages[-5:]:
        history += f"{msg.role}: {msg.content}\n"
        
    # Fetch live inventory
    inventory_context = await fetch_inventory()

    async def event_generator():
        # Check readiness logic needs to accumulate full text
        full_response = ""
        
        async for chunk in rag_service.chat_stream(user_msg, history, inventory_context):
            full_response += chunk
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/plain")

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    user_msg = request.message
    project = request.project
    
    # Construct history context
    history = ""
    for msg in project.messages[-5:]:
        history += f"{msg.role}: {msg.content}\n"
        
    # Fetch live inventory
    inventory_context = await fetch_inventory()

    try:
        response_text = rag_service.chat(user_msg, history, inventory_context)
    except Exception as e:
        print(f"RAG Error: {e}")
        response_text = "I'm having trouble accessing my manuals right now."

    # Readiness logic (Token based)
    should_show_generate = False
    
    if "[[READY]]" in response_text:
        should_show_generate = True
        response_text = response_text.replace("[[READY]]", "").strip()

    ai_message = ChatMessage(
        id=str(uuid.uuid4()),
        role="ai",
        content=response_text,
        timestamp=datetime.now().isoformat(),
        isReadyToGenerate=should_show_generate,
        citations=[]
    )
    
    return ChatResponse(message=ai_message, shouldShowGenerateButton=should_show_generate)

async def generate_blueprint_task(project: DetailedProject):
    project_id = project.project_id
    status = active_generations[project_id]
    
    status.status = "generating_text"
    status.progress = 10
    
    try:
        # 1. Generate JSON Plan
        # Fetch live inventory first
        inventory_context = await fetch_inventory()
        description_context = f"{project.proj_title} {project.proj_desc}"
        json_plan_str = rag_service.generate_plan(description_context, inventory_context=inventory_context)
        
        try:
            plan_data = json.loads(json_plan_str)
        except json.JSONDecodeError:
            print(f"Failed to parse JSON: {json_plan_str}")
            status.status = "error"
            return

        # Map to Pydantic Models and Update Project
        project.proj_title = plan_data.get("proj_title", project.proj_title)
        project.proj_desc = plan_data.get("proj_desc", project.proj_desc)
        project.final_img_prompt = plan_data.get("final_img_prompt")
        
        # Materials
        raw_materials = plan_data.get("materials", [])
        project.materials = [ProjectMaterial(**m) for m in raw_materials]
        
        # Steps
        raw_steps = plan_data.get("steps", [])
        new_steps = []
        for s in raw_steps:
             # handle mat_reqs conversion if needed
             mat_reqs = [MaterialReq(**mr) for mr in s.get("mat_reqs", [])]
             s['mat_reqs'] = mat_reqs
             new_steps.append(Step(**s))
        project.steps = new_steps
        
        status.progress = 25
        status.status = "generating_images"
        
        # 2. Iterate steps and generate images
        total_steps = len(project.steps)
        for i, step in enumerate(project.steps):
            status.currentStep = f"Step {step.step_num}: {step.step_title}"
            
            # Use step_img_prompt
            prompt = step.step_img_prompt or f"Construction step: {step.step_desc}"
            filename_prefix = f"p_{project_id}_s_{step.step_num}"
            
            filename = image_client.generate_image(prompt, filename_prefix)
            if filename:
                step.step_img = f"http://localhost:{Config.PORT}/images/{filename}"
            
            status.progress = 25 + int((i + 1) / total_steps * 50) # 25 to 75

        # 3. Final Image Generation
        if project.final_img_prompt:
            status.currentStep = "Generating Final Visualization"
            filename = image_client.generate_image(project.final_img_prompt, f"p_{project_id}_final")
            if filename:
                 project.final_img = f"http://localhost:{Config.PORT}/images/{filename}"
        
        status.progress = 90
        
        # 4. Save and Finalize
        project.status = "Completed"
        project.updated_at = datetime.now().isoformat()
        
        # Save to disk (Ingestion)
        save_project_to_disk(project)
        
        status.blueprint = project
        status.status = "complete"
        status.progress = 100
        
    except Exception as e:
        print(f"Generation Error: {e}")
        status.status = "error"

@app.post("/generate")
async def start_generation(request: GenerateRequest, background_tasks: BackgroundTasks):
    project = request.project
    
    # Initialize Status
    status = GenerationStatus(status="initializing", progress=0)
    active_generations[project.project_id] = status
    
    # Start Background Task
    background_tasks.add_task(generate_blueprint_task, project)
    
    return status

@app.get("/generate/{project_id}")
async def get_generation_status(project_id: str):
    if project_id not in active_generations:
        raise HTTPException(status_code=404, detail="Project generation not found")
    
    return active_generations[project_id]

if __name__ == "__main__":
    uvicorn.run("main:app", host=Config.HOST, port=Config.PORT, reload=True)
