import PyPDF2
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

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 0,
  "max_output_tokens": 8192,
}

safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]

system_instruction = "You are a medical summarization tool aimed at assisting healthcare professionals in quickly reviewing patient records. The tool will take the contents of a file as input, which contains various medical reports, prescriptions, and documents related to a patient's medical history. The goal is to generate a concise and informative medical summary in the form of bullet points. The medical summary should include key information extracted from the input file, such as: Patient demographics (age, gender, etc.). Medical history (chronic conditions, past surgeries, allergies, etc.). Current medications and dosages. Laboratory test results (blood tests, imaging scans, etc.). Diagnosis and treatment plans. Recommendations and follow-up instructions. The summary should be organized logically and prioritize critical information. It should also be formatted for quick readability, using bullet points to highlight key details. Additionally, the tool should ensure patient confidentiality and comply with healthcare data security regulations. Given the input file containing diverse medical documents, the system should process the information efficiently, identify relevant data points, and generate an accurate and comprehensive medical summary.\n\n"

model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              system_instruction=system_instruction,
                              safety_settings=safety_settings)

def read_pdf(file_path):
    # Open the PDF file in binary mode
    with open(file_path, 'rb') as file:
        # Create a PDF file reader object
        reader = PyPDF2.PdfReader(file)
        
        # Initialize an empty string to store the text
        text = ""
        
        # Loop through each page in the PDF
        for page_num in range(len(reader.pages)):
            # Get the page object
            page = reader.pages[page_num]
            
            # Extract text from the page
            page_text = page.extract_text()
            
            # Append the page text to the overall text
            text += page_text
            
        return text

def FilestoReport(files):
    #files is a list of pdf files 
    #generate consolidated txt file
    f = open("ConsolidatedFile.txt","w")
    for i in files:
        f.write("Name Of File :"+i+"\n")
        s = read_pdf(i)
        f.write(s)
        f.write("\n\n")
    f.close()
    f = open("ConsolidatedFile.txt","r")
    data = f.read()

    response = model.generate_content("Generate a medical summary given the contents of the medical reports and prescriptions \n"+data)
    print(response)
    # system_prompt = "You are developing a medical summarization tool aimed at assisting healthcare professionals in quickly reviewing patient records. The tool will take the contents of a file as input, which contains various medical reports, prescriptions, and documents related to a patient's medical history. The goal is to generate a concise and informative medical summary in the form of bullet points. The medical summary should include key information extracted from the input file, such as: Patient demographics (age, gender, etc.). Medical history (chronic conditions, past surgeries, allergies, etc.). Current medications and dosages. Laboratory test results (blood tests, imaging scans, etc.). Diagnosis and treatment plans. . The summary should be organized logically and prioritize critical information. It should also be formatted for quick readability, using bullet points to highlight key details. Additionally, the tool should ensure patient confidentiality and comply with healthcare data security regulations. Given the input file containing diverse medical documents, the system should process the information efficiently, identify relevant data points, and generate an accurate and comprehensive medical summary."
    
# FilestoReport(["C:/Users/alamu/Documents/CodHer/WellNest/file1.pdf","C:/Users/alamu/Documents/CodHer/WellNest/file2.pdf"])