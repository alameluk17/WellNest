import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage'; 
import { useUser } from "../database/UserContext";

export default function UploadVitalsFilesScreen({ navigation }) {
  const { userEmail } = useUser();
  const storage = getStorage();

  const handlePickDocument = async (folderName) => {
    try {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', 
      });

      if (result && !result.cancelled) {
        const assets = result.assets[0];
        const uri = assets.uri
        const filename = assets.name
        // const extension = uri.split('.').pop(); // Get file extension from URI
        const name = `${formattedDate}_${folderName}_${filename}`; // Append extension to name
        const folderRef = ref(storage, userEmail + '/' + folderName + '/' + name);
        const response = await fetch(uri);
        const blob = await response.blob();
        await uploadBytes(folderRef, blob);
        console.log('File uploaded successfully!');
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => handlePickDocument('prescriptions')}>
        <Text style={styles.buttonText}>Upload Prescription</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => handlePickDocument('medReports')}>
        <Text style={styles.buttonText}>Upload Medical Reports/Test Results</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => handlePickDocument('miscellaneous')}>
        <Text style={styles.buttonText}>Upload Miscellaneous</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 70,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
  },
});
