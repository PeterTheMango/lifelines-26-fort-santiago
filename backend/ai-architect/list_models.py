import os
from dotenv import load_dotenv
from google import genai

# Load env
load_dotenv(r"d:\GABRIEL\Hackathons\lifelines-fort-santiago\MAIN\lifelines-26-fort-santiago\frontend\.env.local")
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Error: GEMINI_API_KEY not found.")
    exit(1)

print("Initializing client...")
client = genai.Client(api_key=api_key, http_options={'api_version': 'v1beta'})

print("Listing models (v1beta)...")
try:
    for model in client.models.list():
        print(f"Model: {model.name}")
except Exception as e:
    print(f"Error: {e}")
