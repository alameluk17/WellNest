import json
from fastapi import FastAPI, HTTPException, Request
from typing import List
import firebase_admin
from firebase_admin import credentials, db
import datetime
from email.mime.text import MIMEText
import smtplib
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request as GoogleRequest
from google.apps import meet_v2
import firebase_admin
from firebase_admin import credentials, storage
import MedReportGenerator
import shutil
import os
from datetime import datetime, timedelta

app = FastAPI()
cred = credentials.Certificate(".\wellnest.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://wellnest-ab850-default-rtdb.firebaseio.com/',
    'storageBucket': 'wellnest-ab850.appspot.com'
})

SCOPES = ['https://www.googleapis.com/auth/meetings.space.created']

MedReportModel = MedReportGenerator.CreateMedReportGenerator()

def time_in_range(start, end, current):
    """Returns whether current is in the range [start, end]"""
    return start <= current <= end

def get_doctors_and_send_email(input_time: str):
    """Retrieve doctors available for consultation at the given time and send meeting links to them"""
    try:
        # Retrieve doctors available for consultation
        doctors_ref = db.reference('doctors')
        all_doctors = doctors_ref.get()
        matching_doctors = []
        input_time = datetime.datetime.strptime(input_time, "%I:%M %p").strftime("%H:%M:%S")
        if isinstance(all_doctors, list):
            for doctor_data in all_doctors:
                if isinstance(doctor_data, dict):
                    if 'consultation_time' in doctor_data and ' - ' in doctor_data['consultation_time']:
                        doctor_consultation_time = doctor_data['consultation_time']
                        start_time_str, end_time_str = doctor_consultation_time.split(' - ')
                        # print(start_time_str,end_time_str)
                        start_time = datetime.datetime.strptime(start_time_str, "%I:%M %p").strftime("%H:%M:%S")
                        end_time = datetime.datetime.strptime(end_time_str, "%I:%M %p").strftime("%H:%M:%S")
                        # print(start_time,end_time)

                        if time_in_range(start_time, end_time, input_time):
                            matching_doctors.append({
                                'name': doctor_data.get('name', ''),
                                'email': doctor_data.get('email', ''),
                                'specialization': doctor_data.get('specialization', ''),
                                'consultation_time': doctor_consultation_time
                            })

        # Generate meeting link
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        if not creds or not creds.valid:
            creds.refresh(GoogleRequest())
            with open('token.json', 'w') as token:
                token.write(creds.to_json())

        client = meet_v2.SpacesServiceClient(credentials=creds)
        request = meet_v2.CreateSpaceRequest()
        response = client.create_space(request=request)
        meeting_link = response.meeting_uri  # Store the meeting link

        # Send meeting links to doctors
        smtp_server = 'smtp.gmail.com'
        smtp_port = 587
        smtp_username = 'heera2110382@ssn.edu.in'
        smtp_password = 'qoetosqebaqlgwbc'

        msg_body = 'You have a new appointment request for consultation at {}. Please confirm your availability.\n\nBest regards,\nYour Clinic'.format(input_time)
        print(matching_doctors)
        for doctor in matching_doctors:
            msg = MIMEText(msg_body + '\n\nMeeting Link: ' + meeting_link)
            msg['Subject'] = 'Appointment Request'
            msg['From'] = smtp_username
            msg['To'] = doctor['email']

            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.send_message(msg)

        return {"message": "Appointment request emails sent to matching doctors."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import logging

@app.post("/send-appointment-request")
async def send_appointment_request(request: Request):
    try:
        body = await request.body()
        body = json.loads(body)
        input_time = body["input_time"]
        
        logging.info(f"Received input_time: {input_time}")

        return get_doctors_and_send_email(input_time)
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

    
def list_files_in_folder(folder_path):
    file_list = []
    for filename in os.listdir(folder_path):
        if os.path.isfile(os.path.join(folder_path, filename)):
            file_list.append("./Temp/"+filename)
            print(file_list)
    return file_list

@app.post("/GenerateMedReport")
async def GenerateMedReport(request: Request):
    body = await request.body()
    jsonip = json.loads(body)
    user_email = jsonip["user_email"]

    # Initialize Firebase Storage client
    bucket = storage.bucket()

    # Get list of files from Firebase Storage
    blobs = bucket.list_blobs(prefix=user_email)

    # Define the cutoff date (three months ago)
    cutoff_date = datetime.now() - timedelta(days=90)

    # Define a directory to save the files locally
    save_directory = "./Temp"
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)
    files = []
    # Iterate through the files
    
    for blob in blobs:
        # Extract file name and creation date
        file_name = blob.name.split('/')[-1]
        creation_date_str = file_name.split('_')[0]
        creation_date = datetime.strptime(creation_date_str, '%d-%m-%Y')

        # Check if file is within the last three months
        if creation_date >= cutoff_date:
            # Download the file
            local_file_path = os.path.join(save_directory, file_name)
            blob.download_to_filename(local_file_path)

    files = list_files_in_folder("./Temp")
    print(files)
    response = MedReportGenerator.FilestoReport(files,MedReportModel)
    print(response)
    # shutil.rmtree("./Temp")


    return {"message": "Files downloaded successfully."}

