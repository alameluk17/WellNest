import pathlib
import textwrap
import google.generativeai as genai
import google.ai.generativelanguage as glm
from google.api_core import retry
import json
# importing necessary functions from dotenv library
from dotenv import load_dotenv, dotenv_values 
# loading variables from .env file
load_dotenv() 


genai.configure(api_key=GOOGLE_API_KEY)

date = glm.Schema(
    type=glm.Type.OBJECT,
    properties = {
        "DAY":glm.Schema(type=glm.Type.INTEGER),
        "MONTH":glm.Schema(type=glm.Type.INTEGER),
        "YEAR":glm.Schema(type=glm.Type.INTEGER),
    }
  )

prescription_data = glm.Schema(
    type = glm.Type.OBJECT,
    properties = {
        'prescriptiondate':  date,
        'drugname':  glm.Schema(type=glm.Type.STRING),
        'do':  glm.Schema(type=glm.Type.STRING),
        'startdatetime':  date,
        'enddatetime':  date,
        'notes':glm.Schema(type=glm.Type.STRING)
    },
    required=['event_name', 'event_organiser', 'startdatetime',"enddatetime",'duration',"venue"]
)

add_to_database = glm.FunctionDeclaration(
    name="add_to_database",
    description="Adds events to the database.",
    parameters=glm.Schema(
        type=glm.Type.OBJECT,
        properties = {
            'event': event,
        }
    )
)

visionmodel = genai.GenerativeModel(model_name='models/gemini-pro-vision')
fnmodel = genai.GenerativeModel(model_name='models/gemini-1.0-pro-latest')

with open("posttext.txt") as f:
    posttext = f.read()

post_image = {
    'mime_type': 'image/png',
    'data': pathlib.Path('Poster.png').read_bytes()
}

details = "the event name, organisers, starting and ending datetimes, duration in minutes and venue/platform"

image_describe_prompt = f"""Describe the Image Contents in Detail. Mention {details} from the given poster: {posttext}"""

image_describe_request_result = visionmodel.generate_content(
    contents = [image_describe_prompt,post_image],
    request_options={'retry': retry.Retry()},
    )
imagedata =  image_describe_request_result.candidates[0].content.parts[0]


text_image_describe_prompt = f"""Please Add to the Database {details} from the given post data: {posttext} and the given data extracted from the image {imagedata.text}. Add any extra data to the notes section of the database. If the data between the post data and image conflict, the post data text must take priority."""
fnresult = fnmodel.generate_content(
    contents = text_image_describe_prompt,
    request_options={'retry': retry.Retry()},
    tools = [add_to_database],
    tool_config={'function_calling_config':'ANY'}
    )
functioncalldata =  fnresult.candidates[0].content.parts[0].function_call
eventdata = type(functioncalldata).to_dict(functioncalldata)

print(json.dumps(eventdata, indent=4))