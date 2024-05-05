import { Text, StyleSheet, TouchableOpacity, TextInput, View, Button } from 'react-native';
import {useState} from 'react';
import ky from 'ky';
import {useUser} from '../database/UserContext'


export default function TeleconsultScreen(){
    const {userEmail} = useUser()
    const [time,setTime] = useState()
    const handleTeleConsultRequest= async ()=>{
        try {
            const response = await ky.post('http://192.168.29.162:8000/send-appointment-request', {
              json: { input_time: time, user_email: userEmail },
            })
            const data = await response.json()
        
            console.log(data); 
            return response;
          } catch (error) {
            console.error(error);
            throw new Error('Failed to send appointment request');
          }

    }
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Preffered Time eg. 9:00 AM"
                value={time}
                onChangeText={setTime}
                keyboardType="string"
            />
            <Button title="Send Teleconsult Request" onPress={handleTeleConsultRequest} />

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    backgroundColor: '#fff',
  },
});
