import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  ActivityIndicator,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient'; 

import BottomTabNavigator from "./navigation/BottomTabNavigator";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import OtpVerificationScreen from "./screens/OtpScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
const Stack = createStackNavigator();
const { width, height } = Dimensions.get('window');

const ModernLoader = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.loaderContainer}
    >
      <Animated.View
        style={[
          styles.loaderContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Animated circles */}
        <View style={styles.circlesContainer}>
          <Animated.View
            style={[
              styles.circle,
              styles.circle1,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <Animated.View
            style={[
              styles.circle,
              styles.circle2,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <Animated.View
            style={[
              styles.circle,
              styles.circle3,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
        </View>

        {/* App Logo/Icon placeholder */}
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
  
            <Text style={styles.logoText}>Skill Switch</Text>
          
        </Animated.View>

        {/* Loading spinner */}
        <ActivityIndicator
          size="large"
          color="#ffffff"
          style={styles.spinner}
        />

        {/* Loading text */}
        <Animated.Text
          style={[
            styles.loadingText,
            { opacity: fadeAnim },
          ]}
        >
          Setting up your experience...
        </Animated.Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Please wait a moment...
        </Text>
      </Animated.View>
    </LinearGradient>
  );
};

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
      
        const [authResult] = await Promise.all([
          checkUserAuth(),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);

        setInitialRoute(authResult);
      } catch (err) {
        console.log("Error checking auth:", err);
        setInitialRoute("Login");
      }
    };

    const checkUserAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      
      if (token && user) {
        return "Main";
      } else {
        return "Login";
      }
    };

    checkAuth();
  }, []);

  if (!initialRoute) {
    return <ModernLoader />;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}



const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loaderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlesContainer: {
    position: 'absolute',
    width: width * 0.8,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: '#ffffff',
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: '#ffffff',
    top: -25,
    left: -25,
  },
  circle3: {
    width: 100,
    height: 100,
    backgroundColor: '#ffffff',
    top: 50,
    right: -50,
  },
  logoContainer: {
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
        color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  spinner: {
    marginVertical: 20,
    transform: [{ scale: 1.2 }],
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    fontWeight: '400',
  },
});