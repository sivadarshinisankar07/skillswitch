import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeStack from './HomeStack';
import NotificationsScreen from '../screens/NotificationScreen';
import ChatListScreen from '../screens/ChatListScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const map = {
            Home: 'home',
            Notifications: 'notifications',
            Chats: 'chatbubbles',
            Profile: 'person'
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ea',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, elevation: 5, shadowOpacity: 0.1 },
        headerShown: false
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Chats" component={ChatListScreen} />
       <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}