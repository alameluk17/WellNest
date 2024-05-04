import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from '@react-navigation/native';


import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import { UserProvider } from "./database/UserContext";
import EmergencySOSSlider from './screens/EmergencySOSSlider';



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

// function HomeTabs(){
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;
//           if (route.name === "Search") {
//             iconName = focused ? "search" : "search-outline";
//           } else if (route.name === "Tickets") {
//             iconName = focused ? "ticket" : "ticket-outline";
//           } else if (route.name === "Settings") {
//             iconName = focused ? "settings" : "settings-outline";
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "black",
//         tabBarInactiveTintColor: "gray",
//         tabBarStyle: {
//           paddingBottom: 15,
//           paddingTop: 15,
//           height: 80,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//         },
//       })}
//     >
//       <Tab.Screen
//         name="Search"
//         component={SearchScreen}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name="Tickets"
//         component={TicketsScreen}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{ headerShown: false }}
//       />
//     </Tab.Navigator>
//   );
// }

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
            <Stack.Screen
              name="SOS"
              component={EmergencySOSSlider}
              options={{headerShown:false}}
              />
        </Stack.Navigator>
      </NavigationContainer>
      </UserProvider>
    )
}