import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from "./database/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { Header } from '@react-navigation/stack';
import { View ,Text, StyleSheet, TouchableOpacity, Image } from 'react-native';




import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen';


import SOSSliderScreen from './screens/SOSSliderScreen';
import TeleconsultScreen from './screens/TeleconsultScreen';
import MedRemindersScreen from './screens/MedsRemindersScreen';
import UploadVitalsFilesScreen from './screens/UploadVitalsFilesScreen';

import SOSTimerScreen from './screens/SOSTimerScreen';
import NotifyingContacts from './screens/NotifyingContacts';

import Vitals from './screens/VitalsForm';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function HomeTabs(){
  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingTop: 70, paddingBottom: 20 }}>
        <Ionicons name="menu" size={24} color="black" style={{ marginRight: 10, marginLeft: 20 }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>WellNest</Text>
        </View>
        <Image
          source={require('./assets/images/profile.png')}
          style={{ width: 40, height: 40, borderRadius: 20 , marginRight: 20}}
        />
      </View>

      {/* Tab Navigator */}
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "SOS") {
                iconName = focused ? "alert-circle" : "alert-circle-outline";
              } else if (route.name === "Teleconsult") {
                iconName = focused ? "git-commit" : "git-commit-outline";
              } else if (route.name === "Reminders") {
                iconName = focused ? "medkit" : "medkit-outline";
              } else if (route.name === "Upload") {
                iconName = focused ? "cloud-upload" : "cloud-upload-outline"
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              paddingBottom: 15,
              paddingTop: 15,
              height: 80,
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
          })}
        >
          <Tab.Screen
            name="SOS"
            component={SOSSliderScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Teleconsult"
            component={TeleconsultScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Reminders"
            component={MedRemindersScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Upload"
            component={UploadVitalsFilesScreen}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
}

export default function App() {
    return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Welcome"
            component = {WelcomeScreen}
            options={{ headerShown: false }}

          />
          <Stack.Screen
              name="Auth"
              component={AuthStack}
              options={{ headerShown: false }}
            />
            <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="SOSTimer"
              component={SOSTimerScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen 
              name = "NotifyingContacts"
              component = {NotifyingContacts}
              options={{headerShown: false}}
            />
            <Stack.Screen 
              name = "Vitals"
              component = {Vitals}
              options={{headerShown: false}}
            />
        </Stack.Navigator>
      </NavigationContainer>
      </UserProvider>
    )
}