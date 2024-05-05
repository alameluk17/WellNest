from pathlib import Path
import hashlib
import pathlib
import google.generativeai as genai
from google.api_core import retry

# Setup function
def PrescriptionJSONGenerator():
    """
    This function sets up the generative AI model.
    """

    # Configure API key
    genai.configure(api_key="AIzaSyB_e9f_i-cbF0M4JcheOEY6rxdZrcNHp_M")

    # Set up the model
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 0,
        "max_output_tokens": 8192,
    }

    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    ]

    system_instruction = "Yourare a  system that processes a prescription image and extracts information about the prescribed medications along with their dosages. The prescription image may contain multiple medications with their respective dosages listed in various formats.\n\nYou should be able to perform the following steps:\n\nProcess the prescription image to identify medication names and dosages.\nCreate a JSON object where each medication is represented as a dictionary with \"Medicine_name\" and \"dosage\" and \"frequency\" keys."

    model = genai.GenerativeModel(
        model_name="gemini-pro-vision",
        generation_config=generation_config,
        system_instruction=system_instruction,
        safety_settings=safety_settings,
    )

    return model

# Function to upload image files if needed
def upload_image_if_needed(pathname: str) -> list[str]:
    """
    This function uploads an image file if needed and returns its URI.
    """
    path = Path(pathname)
    hash_id = hashlib.sha256(path.read_bytes()).hexdigest()
    try:
        existing_file = genai.get_file(name=hash_id)
        return [existing_file.uri]
    except:
        pass
    uploaded_file = genai.upload_file(path=path, display_name=hash_id)
    return [uploaded_file.uri]


# Function to generate response based on prescription image
def generate_response_from_image(model, image_path):
    """
    This function generates a response based on the given prescription image.
    """
    model = genai.GenerativeModel('gemini-pro-vision')
    post_image = {
    'mime_type': 'image/png',
    'data': pathlib.Path(image_path).read_bytes()
    }

    image_describe_prompt = "This is the prescription. Please extract relevant information and give it in JSON format"
    response = model.generate_content([image_describe_prompt, post_image]
    )
    imagedata =  response.candidates[0].content.parts[0]

#     uploaded_files = []
#     image_uri = upload_image_if_needed(image_path)

#     response = model.generate_content([
#     {"role": "user", "parts": image_uri},
#     {"role": "user", "parts": [" This is the prescription. Please extract relevant information and give it in JSON format"]}
# ])
#     # response = convo.last.text

#     # Clean up uploaded files
#     for uploaded_file in uploaded_files:
#         genai.delete_file(name=uploaded_file.name)
    
    print(response)
    return response

# model = PrescriptionJSONGenerator()
# generate_response_from_image(model,"C:/Users/alamu/Documents/CodHer/WellNest/Backend/Temp/samplepres.png")