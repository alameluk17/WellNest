import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Modal } from 'react-native';

const EmergencySOSSlider = () => {
  const slideX = useRef(new Animated.Value(0)).current;
  const [sosActivated, setSOSActivated] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState(10);

  const handleCancelSOS = () => {
    setSOSActivated(false);
    setShowTimerModal(false);
    Animated.spring(slideX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleSlideComplete = () => {
    setSOSActivated(true);
    setShowTimerModal(true);
    Animated.timing(slideX, {
      toValue: -400, // Slide fully to the left
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Start countdown
    let timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    // Stop countdown after 10 seconds
    setTimeout(() => {
      clearInterval(timer);
      setShowTimerModal(false);
      // Perform action after 10 seconds (e.g., make emergency call)
      console.log('Emergency call initiated!');
    }, 10000);
  };

  useEffect(() => {
    // Reset remaining time when modal is shown
    if (showTimerModal) {
      setRemainingTime(10);
    }
  }, [showTimerModal]);

  return (
    <View style={styles.container}>
      <Animated.View
      style={[
        styles.slider,
        {
          transform: [
            {
              translateX: slideX.interpolate({
                inputRange: [0, -400], // Corrected inputRange
                outputRange: [0, -400],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}
    />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    width: 100,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 25,
    position: 'absolute',
    left: 0,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
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
