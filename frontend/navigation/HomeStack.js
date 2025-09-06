import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileDetail from '../screens/ProfileDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import { View } from 'react-native';
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: '#000',
        },
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        // This is key for consistent spacing
        statusBarBackgroundColor: 'transparent',
        statusBarTranslucent: true,
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ProfileDetail" 
        component={ProfileDetail}
        options={{ headerShown: false }} 

      />
      <Stack.Screen 
        name="ChatScreen" 
        component={ChatScreen} 
        options={{ headerShown: false }} 

      />
    </Stack.Navigator>
  );
}