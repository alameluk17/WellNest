import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useUser } from '../database/UserContext';
import axios from 'axios';
import ky from 'ky';

export default function App() {
  const { userEmail } = useUser();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(location);

      // Send user email and GPS location to the backend
      if (userEmail && location) {
        sendEmergencyRequest(userEmail, location);
      }
    })();
  }, []);




  const sendEmergencyRequest = async (userEmail, location) => {
    try {
        console.log(location)
      const str_loc = JSON.stringify(location)
      const response = await ky.get('http://192.168.29.162:8000/emergency', {
        searchParams: {
          user_email: userEmail,
          gps_location: str_loc
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }).json();
  
      console.log(response); 
    } catch (error) {
      console.error(error);
    }
  };
  

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
