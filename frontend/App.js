import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import { UserProvider } from "./database/UserContext";



const Stack = createNativeStackNavigator();

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
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
        </Stack.Navigator>
      </NavigationContainer>
      </UserProvider>
    )
}