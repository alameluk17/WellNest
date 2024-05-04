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


app = FastAPI()
cred = credentials.Certificate(".\wellnest.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://wellnest-ab850-default-rtdb.firebaseio.com/'
})

SCOPES = ['https://www.googleapis.com/auth/meetings.space.created']

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

