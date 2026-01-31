from pydantic import BaseModel, Field
from typing import List, Optional, Union
from datetime import datetime

# --- Chat Models ---

class ChatMessage(BaseModel):
    id: str
    role: str  # 'user', 'ai', 'system'
    content: str
    timestamp: Optional[str] = None
    isReadyToGenerate: Optional[bool] = False
    citations: Optional[List[dict]] = []

# --- Detailed Schema Models ---

class MaterialReq(BaseModel):
    mat_id: str
    req_amt: Union[float, str]
    unit: str

class Step(BaseModel):
    step_num: int
    step_title: str
    step_desc: str
    step_img_prompt: str
    step_img: Optional[str] = None
    mat_reqs: List[MaterialReq] = []
    tips: List[str] = [] # Keeping this as it's useful

class ProjectMaterial(BaseModel):
    material: str
    status: str # "held" / "used"

class DetailedProject(BaseModel):
    project_id: str
    proj_title: str
    proj_desc: str
    status: str # "Planning"/"In_Progress"/"Completed"
    messages: List[ChatMessage]
    steps: List[Step] = []
    final_img_prompt: Optional[str] = None
    final_img: Optional[str] = None
    materials: List[ProjectMaterial] = []
    created_at: str
    updated_at: str

class ChatRequest(BaseModel):
    message: str
    project: DetailedProject

class ChatResponse(BaseModel):
    message: ChatMessage
    shouldShowGenerateButton: bool

class GenerateRequest(BaseModel):
    project: DetailedProject

class GenerationStatus(BaseModel):
    status: str # 'initializing', 'generating_text', 'generating_images', 'complete', 'error'
    progress: int
    currentStep: Optional[str] = None
    blueprint: Optional[DetailedProject] = None
