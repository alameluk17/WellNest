import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Modal, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo

export default function SOSTimerScreen({ navigation }) {
    const [seconds, setSeconds] = useState(10);
    const [modalVisible, setModalVisible] = useState(true);

    const circleAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prevSeconds => {
                if (prevSeconds === 1) {
                    clearInterval(timer);
                    setModalVisible(false);
                    navigation.navigate("NotifyingContacts")
                    console.log("here")
                    return 0;
                }
                return prevSeconds - 1;
            });
        }, 1000);

        // Circle animation
        Animated.timing(circleAnimation, {
            toValue: 1,
            duration: seconds * 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();

        return () => {
            clearInterval(timer);
            }
    }, []);

    const onCancelPress = () => {
        setModalVisible(false);
        navigation.goBack();
    };

    const interpolatedColor = circleAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255,0,0,1)', 'rgba(255,200,200,1)'], // Red to light red
    });
    
    const circleStyle = {
        ...styles.timerCircle,
        borderColor: interpolatedColor,
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)} // Close modal on back button press
        >
            <View style={styles.modalContainer}>
                <Text style={styles.topText}>
                    Emergency SOS
                </Text>
                <View style={styles.bulletPoints}>
                    <Ionicons name="checkmark" size={24} color="green" />
                    <Text style={styles.bulletText}>Notify Emergency Contacts</Text>
                </View>
                <View style={styles.bulletPoints}>
                    <Ionicons name="checkmark" size={24} color="green" />
                    <Text style={styles.bulletText}>Notify nearby ambulance services</Text>
                </View>
                <View style={styles.lastbulletPoints}>
                    <Ionicons name="checkmark" size={24} color="green" />
                    <Text style={styles.bulletText}>Share location</Text>
                </View>
                <Animated.View style={circleStyle}>
                    <Text style={styles.timerText}>{seconds}</Text>
                </Animated.View>
                <TouchableOpacity onPress={onCancelPress} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: 'left',
        backgroundColor: 'black',
        paddingVertical: 70,
        paddingHorizontal: 30
    },
    topText: {
        fontSize: 30,
        color: 'white',
        paddingBottom: 35
    },
    descriptionText: {
        fontSize: 16,
        color: 'white',
        marginBottom: 20,
    },
    timerCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 70
    },
    timerText: {
        fontSize: 40,
        color: 'white',
    },
    bulletPoints: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10
    },
    bulletText: {
        fontSize: 16,
        color: 'white',
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#fff', // Lighter shade of red
        padding: 10,
        paddingHorizontal: 100,
        borderRadius: 5,
        marginTop: 120,
        alignSelf: 'center', // Center the button horizontally
        elevation: 3, // Add elevation for a subtle shadow
    },
    cancelButtonText: {
        color: '#000', // White text color
        fontSize: 18,
    },
    lastbulletPoints: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 80
    }
});
