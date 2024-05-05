import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const Vitals = ({navigation}) => {
  const [bp, setBp] = useState('');
  const [sugar, setSugar] = useState('');
  const [oxygenLevel, setOxygenLevel] = useState('');
  const [pulse, setPulse] = useState('');
  const [breathingRate, setBreathingRate] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Fetch the current user's email
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const storage = getStorage();

  const handleUploadVitals = async () => {
    try {

      const currentDate = new Date().toLocaleDateString('en-GB');
      const [day, month, year] = currentDate.split('/');
      const formattedDate = `${day}-${month}-${year}`;
      // Format the vitals data as plain text
      const vitalsData = `Date,Blood Pressure,Sugar,Oxygen Level,Pulse,Breathing Rate\n${formattedDate},${bp},${sugar},${oxygenLevel},${pulse},${breathingRate}\n`;

      // Convert the vitals data to bytes
      const vitalsBytes = new Blob([vitalsData], { type: 'text/csv' });

      // Generate filename with current date as prefix
      const filename = 'vitals.csv'
      // Get a reference to the CSV file in Firebase Storage
      const storageRef = ref(storage, `${userEmail}/${filename}`);

      // Upload the vitals data to Firebase Storage, overwriting any existing file
      await uploadBytes(storageRef, vitalsBytes);

      setBp('');
      setSugar('');
      setOxygenLevel('');
      setPulse('');
      setBreathingRate('');

      // Show success message
      Alert.alert('Success', 'Vitals uploaded successfully!');
      navigation.goBack()
    } catch (error) {
      console.error('Error uploading vitals:', error);
      Alert.alert('Error', 'Failed to upload vitals. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Blood Pressure"
        value={bp}
        onChangeText={setBp}
        keyboardType="string"
      />
      <TextInput
        style={styles.input}
        placeholder="Blood Glucose Level"
        value={sugar}
        onChangeText={setSugar}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Oxygen Level"
        value={oxygenLevel}
        onChangeText={setOxygenLevel}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Pulse"
        value={pulse}
        onChangeText={setPulse}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Breathing rate"
        value={breathingRate}
        onChangeText={setBreathingRate}
        keyboardType="numeric"
      />
      <Button title="Update Vitals" onPress={handleUploadVitals} />
    </View>
  );
};

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

export default Vitals;
