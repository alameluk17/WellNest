import { View, Text, Pressable, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from 'react';
import * as DocumentPicker from 'expo-document-picker';
import {app} from '../database/firebaseconfig'
import { getStorage, ref, uploadBytes } from 'firebase/storage'; 

export default function HomeScreen({navigation}){
    const storage = getStorage(app);
    const handlePickDocument = async () => {
        try {
            console.log('Hello World')
          const result = await DocumentPicker.getDocumentAsync({
            type: '*/*', 
          });
    
          if (result && !result.cancelled) {
            const assets = result["assets"][0]
            const uri = assets["uri"]
            const name = assets["name"]
            const storageRef = ref(storage);
            const fileRef = ref(storageRef, name); 
            const response = await fetch(uri);
            const blob = await response.blob();
            await uploadBytes(fileRef, blob);
    
            console.log('File uploaded successfully!');
          }
        } catch (error) {
        //   console.error('Error picking document:', error);
        }
      };
    
      return (
        <TouchableOpacity style={styles.buttonContainer} onPress={handlePickDocument}>
          <Text style={styles.buttonText}>Upload File</Text>
        </TouchableOpacity>
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