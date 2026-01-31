import os
from google import genai
from google.genai import types
from config import Config

class ImageClient:
    def __init__(self):
        if Config.GEMINI_API_KEY:
            # Use default client (usually v1beta/v1) as model exists there
            self.client = genai.Client(api_key=Config.GEMINI_API_KEY)
        else:
            print("Warning: GEMINI_API_KEY not found in Config.")
            self.client = None

    def warmup(self):
        print("Initializing Gemini Image Client (v2 SDK)...")
        pass

    def generate_image(self, prompt_text: str, filename_prefix: str = "architect_step") -> str:
        """Generates an image using Gemini's generate_content (for flash-image models)."""
        print(f"Generating image with Gemini ({Config.GEMINI_IMAGE_MODEL}) for: {filename_prefix}")
        
        if not self.client:
            print("Client not initialized.")
            return None

        try:
            # Using generate_content as per documentation for gemini-2.5-flash-image
            response = self.client.models.generate_content(
                model=Config.GEMINI_IMAGE_MODEL,
                contents=[prompt_text],
                config=types.GenerateContentConfig(
                    temperature=1.0, # Optional: Add generation params if needed, but remove mime_type
                )
            )
            
            # Iterate through parts to find the image
            if response.parts:
                for part in response.parts:
                    if part.inline_data:
                        filename = f"{filename_prefix}.png"
                        local_path = os.path.join(Config.GENERATED_IMAGES_DIR, filename)
                        
                        # Use the SDK's helper if available, or PIL
                        try:
                            image = part.as_image()
                            image.save(local_path)
                            print(f"Image saved to {local_path}")
                            return filename
                        except Exception as img_err:
                            print(f"Error saving image part: {img_err}")
                            # Fallback if as_image fails or behaves differently
                            if hasattr(part.inline_data, 'data'):
                                import base64
                                with open(local_path, "wb") as f:
                                    f.write(base64.b64decode(part.inline_data.data))
                                return filename

            print("No inline image data found in response.")
            # Debug: print text if any
            for part in response.parts:
                if part.text:
                    print(f"Response text: {part.text}")
                    
            return None

        except Exception as e:
            print(f"Gemini Image Gen Error: {e}")
            return None
