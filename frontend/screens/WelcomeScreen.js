import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import React, {useState} from "react";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../components/Button";
import languages from "../constants/language";

// const translatedWelcomeBack = useTranslation(
//   "Welcome back",
//   "en",
//   selectedLanguage
// );
// const translatedLogin = useTranslation("Login", "en", selectedLanguage);
// const translatedDontHaveAccount = useTranslation(
//   "Don't have an account?",
//   "en",
//   selectedLanguage
// );

const translatedRegister = useTranslation("Register", "eng_Latn", selectedLanguage);

const WelcomeScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  return (
    <LinearGradient style={styles.container} colors={["#2b88c5", "#FFFFFF"]}>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
        style={styles.picker}
      >
        {Object.entries(languages).map(([label, value]) => (
          <Picker.Item key={value} label={label} value={value} />
        ))}
      </Picker>
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
