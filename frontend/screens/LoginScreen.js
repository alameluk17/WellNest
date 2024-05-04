// TempleDetailScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // Make sure you import Ionicons
import LoginMailScreen from "./LoginMailScreen";
import LoginPhoneScreen from "./LoginPhoneScreen";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

// Top tabs navigator component
const LoginMethodsTopTab = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: "#000", // Active label color
        tabBarInactiveTintColor: "gray", // Inactive label color
        tabBarLabelStyle: {
          fontSize: 14,
          textTransform: "none", // This prevents uppercase styling
          fontWeight: "bold", // Default weight for inactive tabs
        },
        tabBarIndicatorStyle: { backgroundColor: "#000" },
        tabBarPressColor: "#ddd",
        tabBarStyle: { backgroundColor: "white" },
        tabBarIndicatorContainerStyle: { backgroundColor: "white" },
        tabBarActiveLabelStyle: { fontWeight: "bold" }, // Custom property, not provided by library
      })}
    >
      <Tab.Screen
        name="Email"
        component={LoginMailScreen}

      />
      <Tab.Screen
        name="Phone number"
        component={LoginPhoneScreen}
      />
    </Tab.Navigator>
  );
};

const LoginScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerTitle}>Log In</Text>
      <LoginMethodsTopTab/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  backButton: {
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginLeft: 20, 
    margin: 10,
  },

  templeName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  templeLocation: {
    fontSize: 16,
    color: "gray",
  },

  tempnameloc: {
    marginLeft: 20,
  },
});

export default LoginScreen;
