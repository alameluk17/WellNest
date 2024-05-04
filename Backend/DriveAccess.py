from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive

def Login():
    gauth = GoogleAuth()
    gauth.LocalWebserverAuth()
    drive = GoogleDrive(gauth)
    print(drive)
    return drive

k = Login()
print(k)