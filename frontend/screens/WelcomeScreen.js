import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button";

const WelcomeScreen = ({ navigation }) => {
  return (
    <LinearGradient style={styles.container} colors={["#2b88c5", "#FFFFFF"]}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>WellNest</Text>
        <Text style={styles.subtitle}>
          Intertwining Care, Community and Modern Technology
        </Text>
      </View>

      <Button
        title="Let's get started!"
        onPress={() => navigation.navigate("Auth", { screen: "Register" })}
        style={styles.joinNowButton}
      />

      <View style={styles.loginSuggestion}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Pressable
          onPress={() => navigation.navigate("Auth", { screen: "Login" })}
        >
          <Text style={styles.loginButton}>Login</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },
  logo: {
    height: 175,
    width: 325,
    marginBottom: 90,
    marginTop: 110,
  },
  textContainer: {
    width: "90%",
    alignItems: "center",
    marginBottom: 90,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
  },
  joinNowButton: {
    width: "100%",
    marginTop: 20,
  },
  loginSuggestion: {
    flexDirection: "row",
    marginTop: 17,
    justifyContent: "center",
  },
  loginText: {
    fontSize: 16,
    color: "#000",
  },
  loginButton: {
    fontSize: 16,
    color: "#2b88c5",
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default WelcomeScreen;
