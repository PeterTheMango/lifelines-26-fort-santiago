import os
import glob
from typing import List, Tuple
from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
# from langchain_ollama import OllamaLLM # Removed
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_text_splitters import RecursiveCharacterTextSplitter

from config import Config
from models import DetailedProject, Step

class RAGService:
    def __init__(self):
        # Lazy load embeddings to speed up startup
        self.embeddings = None
        
        self.vector_store = None
        self.llm = ChatGoogleGenerativeAI(
            model=Config.GEMINI_MODEL,
            google_api_key=Config.GEMINI_API_KEY,
            temperature=0.2,
            # convert_system_message_to_human=True # Not strictly needed for newer models
        )
        self.retriever = None

    def initialize_index(self):
        """Loads PDFs and builds FAISS index."""
        print("Initializing RAG Index...")
        
        if not self.embeddings:
            print("Loading Embedding Model...")
            self.embeddings = HuggingFaceEmbeddings(
                model_name=Config.EMBEDDING_MODEL,
                encode_kwargs={'normalize_embeddings': True}
            )
        
        # 1. Try to load existing index
        if os.path.exists(os.path.join(Config.FAISS_INDEX_DIR, "index.faiss")):
            try:
                print("Loading RAG Index from disk...")
                self.vector_store = FAISS.load_local(
                    Config.FAISS_INDEX_DIR, 
                    self.embeddings,
                    allow_dangerous_deserialization=True
                )
                self.retriever = self.vector_store.as_retriever(search_kwargs={"k": 4})
                print("RAG Index loaded successfully from disk.")
                return
            except Exception as e:
                print(f"Failed to load index from disk: {e}. Rebuilding...")

        # 2. If no index or load failed, build from scratch
        # Suppress pypdf noise
        import logging
        logging.getLogger("pypdf").setLevel(logging.ERROR)
        
        docs = []
        
        # Load PDFs
        pdf_files = glob.glob(os.path.join(Config.RAG_DOCS_DIR, "**/*.pdf"), recursive=True)
        print(f"Found {len(pdf_files)} PDF files in {Config.RAG_DOCS_DIR}")
        
        for file_path in pdf_files:
            try:
                # Use print just to show progress without spamming
                print(f"Loading {os.path.basename(file_path)}...", end="\r") 
                loader = PyPDFLoader(file_path)
                docs.extend(loader.load())
            except Exception as e:
                print(f"\nSkipping {os.path.basename(file_path)}: {e}")
        
        print(f"\nLoaded {len(docs)} pages from PDFs.")
                
        if not docs:
            print("No documents loaded for RAG. Using dummy content.")
            from langchain.schema import Document
            docs = [Document(page_content="Emergency Shelter Construction Manual. Use wood and tarps for temporary shelters.")]

        # Split text
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)
        
        # Build Index
        self.vector_store = FAISS.from_documents(splits, self.embeddings)
        
        # Save Index
        self.vector_store.save_local(Config.FAISS_INDEX_DIR)
        print(f"RAG Index saved/exported to {Config.FAISS_INDEX_DIR}")
        
        self.retriever = self.vector_store.as_retriever(search_kwargs={"k": 4})
        print(f"RAG Index initialized with {len(splits)} chunks.")

    def chat(self, user_message: str, history_context: str = "", inventory_context: str = "") -> str:
        """Simple chat with retrieval."""
        if not self.retriever:
            return "System is initializing, please wait..."
            
        # Retrieve docs
        docs = self.retriever.invoke(user_message)
        context = "\n\n".join([d.page_content for d in docs])
        
        prompt = f"""You are a helpful and knowledgeable AI Architect for Crisis Response.
        
        Your goal is to help users design safe and effective emergency shelters using available resources.
        
        Guidelines:
        1. Be helpful, constructive, and concise. Keep your response to a SHORT single paragraph unless absolutely necessary.
        2. Always ask 1-2 specific questions to clarify project objectives, constraints, or materials until you have enough information for a full plan.
        3. Use the provided Context as your primary guide for materials and methods, but you may supplement with general engineering knowledge if the context is incomplete.
        4. If the user lacks specific materials, suggest alternatives based on the context or general principles.
        5. Do NOT refuse to help unless the request is clearly malicious or fundamentally unsafe.
        
        Readiness Check:
        When you have gathered sufficient details (materials, dimensions/capacity, purpose) to generate a full construction plan, you MUST append the token [[READY]] to the very end of your response. Do not append it if you still need to ask questions.
        
        Inventory Context:
        {inventory_context}
        
        Context:
        {context}
        
        Conversation History:
        {history_context}
        
        User: {user_message}
        
        Assistant:"""
        
        cleaned_prompt = prompt.replace("\n", " ") # Basic cleaning
        response = self.llm.invoke(prompt)
        
        # ChatGoogleGenerativeAI returns an AIMessage, not a string directly.
        if hasattr(response, 'content'):
            return response.content
        return str(response)

    async def chat_stream(self, user_message: str, history_context: str = "", inventory_context: str = ""):
        """Streaming chat with retrieval."""
        if not self.retriever:
            yield "System is initializing, please wait..."
            return
            
        # Retrieve docs
        docs = self.retriever.invoke(user_message)
        context = "\n\n".join([d.page_content for d in docs])
        
        prompt = f"""You are a helpful and knowledgeable AI Architect for Crisis Response.
        
        Your goal is to help users design safe and effective emergency shelters using available resources.
        
        Guidelines:
        1. Be helpful, constructive, and concise. Keep your response to a SHORT single paragraph unless absolutely necessary.
        2. Always ask 1-2 specific questions to clarify project objectives, constraints, or materials until you have enough information for a full plan.
        3. Use the provided Context as your primary guide for materials and methods, but you may supplement with general engineering knowledge if the context is incomplete.
        4. If the user lacks specific materials, suggest alternatives based on the context or general principles.
        5. Do NOT refuse to help unless the request is clearly malicious or fundamentally unsafe.
        
        Readiness Check:
        When you have gathered sufficient details (materials, dimensions/capacity, purpose) to generate a full construction plan, you MUST append the token [[READY]] to the very end of your response. Do not append it if you still need to ask questions.
        
        Inventory Context:
        {inventory_context}
        
        Context:
        {context}
        
        Conversation History:
        {history_context}
        
        User: {user_message}
        
        Assistant:"""
        
        # Use .stream() from LangChain
        async for chunk in self.llm.astream(prompt):
            if hasattr(chunk, 'content'):
                yield chunk.content
            else:
               yield str(chunk)

    def generate_plan(self, project_description: str, inventory_context: str = "") -> str:
        """Generates a structured plan in JSON format."""
        if not self.retriever:
            return "{}"
            
        docs = self.retriever.invoke(project_description)
        context = "\n\n".join([d.page_content for d in docs])
        
        prompt = f"""You are an AI Architect. Generate a detailed construction plan for: "{project_description}".
        
        Constraints:
        1. Use ONLY the materials and methods found in the provided Context AND Inventory Context.
        2. Ensure the plan is safe and structurally sound based on the manuals.
        3. If the request is for a harmful structure, return an error in the description.
        4. STRICTLY check the "Inventory Context" below. You MUST ONLY use materials that are explicitly listed.
           - If a required material is NOT in the Inventory Context, you must check if a reasonable substitute exists in the inventory.
           - If NO substitute exists, you must explicitly mention this shortage in the 'tips' section or 'step_desc', but try to design around it if possible.
        
        Inventory Context:
        {inventory_context}
        
        Context:
        {context}
        
        STRICT JSON OUTPUT FORMAT REQUIRED. Do not include markdown formatting like ```json ... ```. Just the raw JSON string.
        
        Structure:
        {{
            "proj_title": "Title of the plan",
            "proj_desc": "Brief description",
            "materials": [
                {{ "material": "Wood Logs", "status": "held/used" }}
            ],
            "steps": [
                {{
                    "step_num": 1,
                    "step_title": "Step Title",
                    "step_desc": "Detailed instruction...",
                    "step_img_prompt": "Visual description for image generator...",
                    "mat_reqs": [
                        {{ "mat_id": "wood_log", "req_amt": 2, "unit": "logs" }}
                    ],
                    "tips": ["Tip 1"]
                }}
            ],
            "final_img_prompt": "Wide shot of the completed structure..."
        }}
        
        Important: "req_amt" should be a NUMBER (integer or float). Do not use strings like "All" or "Some" unless absolutely unknown.
        """
        
        response = self.llm.invoke(prompt)
        content = response.content if hasattr(response, 'content') else str(response)
        
        # Robust JSON extraction
        try:
            start_index = content.find('{')
            end_index = content.rfind('}')
            if start_index != -1 and end_index != -1:
                content = content[start_index : end_index + 1]
        except Exception as e:
            print(f"Error extracting JSON: {e}")
            
        return content
