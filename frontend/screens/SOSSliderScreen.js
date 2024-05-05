import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SOSSliderScreen({ navigation }) {
    const scaleValue = new Animated.Value(1);

    const startAnimation = () => {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 1.2,
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ]).start(() => {
            navigation.navigate('SOSTimer'); // Navigate to SOSTimerScreen after animation
        });
    };

    return (
        <LinearGradient style={styles.container} colors={["#f0f0f0", "#FFFFFF"]}>
                <TouchableOpacity onPress={startAnimation}>
                <Animated.View style={[styles.button, {transform: [{ scale: scaleValue }]}]}>
                    <Text style={styles.buttonText}>SOS</Text>
                </Animated.View>
            </TouchableOpacity>
            <Text style={styles.infoText}>All your emergency contacts will be notified and nearby ambulance services will be called.</Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Light background color
    },
    button: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#2b88c5',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
    },
    buttonText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    infoText: {
        marginTop: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
        color: '#333', // Dark text color
        fontSize: 17,
        paddingVertical: 20
    },
});
