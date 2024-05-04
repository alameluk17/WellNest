import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Modal } from 'react-native';
import { useUser } from "../database/UserContext"

const EmergencySOSSlider = () => {
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState(10);
  const {userEmail} = useUser ()

  const handleCancelSOS = () => {
    setShowTimerModal(false);
  };

  const handleSlideComplete = () => {
    setShowTimerModal(true);

    // Start countdown
    let timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    // Stop countdown after 10 seconds
    setTimeout(() => {
      clearInterval(timer);
      setShowTimerModal(false);
      console.log('Emergency call initiated!');
      
      // try {
      //     const response = await fetch(`http://localhost:8000/emergency?user_email=${userEmail}`);
      //     const data = await response.json();
      //     console.log(data.emails);
      //     // Perform further actions with the received email data
      // } catch (error) {
      //     console.error('Error fetching emergency emails:', error);
      // }
  }, 10000);
  



  useEffect(() => {
    // Reset remaining time when modal is shown
    if (showTimerModal) {
      setRemainingTime(10);
    }
  }, [showTimerModal]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Slide to activate SOS</Text>
      <Modal visible={showTimerModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Emergency call will be initiated in {remainingTime} seconds</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSOS}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity style={styles.sliderButton} onPress={handleSlideComplete}>
        <Text style={styles.sliderButtonText}>Slide</Text>
      </TouchableOpacity>
    </View>
  );
};
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  sliderButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sliderButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    color: "white"
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EmergencySOSSlider;
