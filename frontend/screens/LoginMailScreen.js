import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from "../constants/colors";
import { useNavigation } from '@react-navigation/native';
import { firebase_auth } from "../database/firebaseconfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"; // Added sendPasswordResetEmail
import { useUser } from "../database/UserContext";


export default function LoginMailScreen({navigation}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUserEmail } = useUser();

    useEffect(() => {
        const unsubscribe = firebase_auth.onAuthStateChanged((user) => {
          if (user) {
            // -- include the api call to backend for drive access
            // Reset the navigation stack and navigate to HomeScreen
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          }
        });
    
        return unsubscribe;
      }, [navigation]);
    

      const handleLogin = () => {
        signInWithEmailAndPassword(firebase_auth, email, password)
          .then((userCredentials) => {
            const user = userCredentials.user;
            console.log("Logged in with ", user.email);
            setUserEmail(user.email);
          })
          .catch((error) => alert("Invalid login credentials"));
      };

      // Function to handle password reset
      const handlePasswordReset = () => {
        if (email.trim() === "") {
          alert("Please enter your email address.");
          return;
        }
      
        sendPasswordResetEmail(firebase_auth, email)
          .then(() => {
            alert("Password reset email sent. Please check your inbox.");
          })
          .catch((error) => {
            console.error("Failed to send password reset email:", error);
            alert("Failed to send password reset email. Please check the email provided and try again.");
          });
      };

    return (
        <View style={styles.container}>
        <Text style={styles.label}>Email </Text>
        <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={"black"}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={"black"}
        />

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.text}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePasswordReset} style={styles.resetPasswordButton}>
            <Text style={styles.resetPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
        </View>
  );
}

// Updated StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    padding: 30,
    marginTop: 30
  },
  input: {
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 8,
  },
  loginButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.PrimaryButtonColor,
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  registerText: {
    color: colors.PrimaryButtonColor,
  },
  resetPasswordButton: {
    marginTop: 15,
    alignSelf: 'center',
  },
  resetPasswordText: {
    color: colors.PrimaryButtonColor,
    fontSize: 14,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    marginBottom: 20,
    fontWeight: "900",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 15

  }
});
