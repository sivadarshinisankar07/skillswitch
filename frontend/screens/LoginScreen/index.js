import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "./style";
import { API_BACKEND } from "../../api";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotifications"; // Fixed typo

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [modalAction, setModalAction] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnimHeader = useRef(new Animated.Value(-50)).current;
  const slideAnimInput1 = useRef(new Animated.Value(50)).current;
  const slideAnimInput2 = useRef(new Animated.Value(50)).current;
  const slideAnimButton = useRef(new Animated.Value(50)).current;
  const slideAnimLink = useRef(new Animated.Value(50)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimHeader, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimInput1, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimInput2, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimButton, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimLink, {
        toValue: 0,
        duration: 600,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const validateInputs = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const registerPushToken = async (userId) => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await axios.post(`${API_BACKEND}/api/profile/pushtoken`, {
          userId,
          token,
        });
      }
    } catch (err) {
      console.log("Push token error:", err.message);
    }
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BACKEND}/api/auth/login`, {
        email,
        password,
      });

      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

      setModalType("success");
      setModalMessage("Logged in successfully!");
      setModalVisible(true);

      // Check if profile exists
      let hasProfile = false;
      try {
        const profileRes = await axios.get(
          `${API_BACKEND}/api/profile/${res.data.user._id}`
        );
        // Check if profile exists and has data
        hasProfile = profileRes.data && Object.keys(profileRes.data).length > 0;
      } catch (profileErr) {
        // Profile doesn't exist or error occurred
        console.log(
          "Profile check error:",
          profileErr.response?.data || profileErr.message
        );
        hasProfile = false;
      }

      setTimeout(() => {
        setModalVisible(false);
        if (!hasProfile) {
          registerPushToken(res.data.user._id);
          navigation.reset({
            index: 0,
            routes: [{ name: "EditProfile", params: { isNewUser: true } }],
          });
        } else {
          registerPushToken(res.data.user._id);
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }], 
          });
        }
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed";
      if (errorMsg.includes("Please verify your account")) {
        try {
          // Trigger OTP resend
          await axios.post(`${API_BACKEND}/api/auth/resend-otp`, { email });
          setModalType("verify");
          setModalMessage("A new OTP has been sent to your email.");
          setModalAction(
            () => () => navigation.navigate("OtpVerification", { email })
          );
        } catch (resendErr) {
          setModalType("error");
          setModalMessage("Failed to resend OTP. Please try again.");
          setModalAction(null);
        }
      } else {
        setModalType("error");
        setModalMessage(errorMsg);
        setModalAction(null);
      }
      setModalVisible(true);
      console.log(err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setModalVisible(false);
    if (modalType === "verify" && modalAction) {
      modalAction();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnimHeader }] },
        ]}
      >
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.inputContainer,
          { transform: [{ translateY: slideAnimInput1 }] },
        ]}
      >
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}
      </Animated.View>

      <Animated.View
        style={[
          styles.inputContainer,
          { transform: [{ translateY: slideAnimInput2 }] },
        ]}
      >
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}
      </Animated.View>

      <Animated.View
        style={[
          styles.buttonContainer,
          { transform: [{ translateY: slideAnimButton }] },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            isLoading && styles.buttonDisabled,
            { transform: [{ scale: buttonScale }] },
          ]}
          onPress={handleLogin}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.linkContainer,
          { transform: [{ translateY: slideAnimLink }] },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal transparent visible={modalVisible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              { opacity: modalAnim, transform: [{ scale: modalAnim }] },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                modalType === "success"
                  ? styles.modalSuccess
                  : modalType === "verify"
                  ? styles.modalVerify
                  : styles.modalError,
              ]}
            >
              {modalType === "success"
                ? "Success"
                : modalType === "verify"
                ? "Verification Required"
                : "Error"}
            </Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>
                {modalType === "verify" ? "Verify Now" : "Close"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
