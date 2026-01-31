import os
from dotenv import load_dotenv

# Load env from frontend/.env.local
# frontend is sibling to backend. ai-architect is in backend.
# Path: backend/ai-architect/config.py -> ../../frontend/.env.local
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", ".env.local")
load_dotenv(env_path)

class Config:
    # Service Settings
    PORT = 8001
    HOST = "0.0.0.0"
    
    # Gemini Settings
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025"
    GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image"
    
    # Legacy/Fallback (optional, can be removed if not needed)
    INVENTORY_SERVICE_URL = os.getenv("INVENTORY_SERVICE_URL", "http://localhost:8000")
    
    # Paths
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    RAG_DOCS_DIR = os.path.join(BASE_DIR, "rag", "documents")
    GENERATED_IMAGES_DIR = os.path.join(BASE_DIR, "generated_images")
    
    # RAG Settings
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
    FAISS_INDEX_DIR = os.path.join(BASE_DIR, "rag", "faiss_index")

# Ensure directories exist
os.makedirs(Config.GENERATED_IMAGES_DIR, exist_ok=True)
os.makedirs(Config.RAG_DOCS_DIR, exist_ok=True)
os.makedirs(Config.FAISS_INDEX_DIR, exist_ok=True)
