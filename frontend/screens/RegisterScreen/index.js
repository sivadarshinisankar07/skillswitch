import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Animated } from 'react-native';
import axios from 'axios';
import styles from './style';
import { API_BACKEND } from '../../api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); 


  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnimHeader = useRef(new Animated.Value(-50)).current;
  const slideAnimInput1 = useRef(new Animated.Value(50)).current;
  const slideAnimInput2 = useRef(new Animated.Value(50)).current;
  const slideAnimInput3 = useRef(new Animated.Value(50)).current;
  const slideAnimButton = useRef(new Animated.Value(50)).current;
  const slideAnimLink = useRef(new Animated.Value(50)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(slideAnimInput3, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimButton, {
        toValue: 0,
        duration: 600,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimLink, {
        toValue: 0,
        duration: 600,
        delay: 600,
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
  const newErrors = { name: "", email: "", password: "" };

  // Name check
  if (!name.trim()) {
    newErrors.name = "Name is required";
    valid = false;
  }

  // Email check
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Enter a valid email";
    valid = false;
  }

  // Password checks
  const passwordErrors = [];
  if (!password || password.length < 8) {
    passwordErrors.push("at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    passwordErrors.push("uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    passwordErrors.push("lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    passwordErrors.push("number");
  }
  if (!/[@$!%*?&+]/.test(password)) {
    passwordErrors.push("special character (@$!%*?&)");
  }

  if (passwordErrors.length > 0) {
    newErrors.password = "Password must include: " + passwordErrors.join(", ");
    valid = false;
  }

  setErrors(newErrors);
  return valid;
};


  const handleRegister = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BACKEND}/api/auth/register`, {
        name,
        email,
        password,
      });
      console.log(res)
      setModalType('success');
      setModalMessage(res.data.message || 'Registered. OTP sent.');
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('OtpVerification', { email });
      }, 2000);
    } catch (err) {
      const errorMessage = err?.response?.data?.error || 'Registration failed';
      setModalType('error');
      setModalMessage(errorMessage);
      setModalVisible(true);
      console.log(err?.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
      <View style={styles.container}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnimHeader }] }]}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us today!</Text>
        </Animated.View>

        <Animated.View style={[styles.inputContainer, { transform: [{ translateY: slideAnimInput1 }] }]}>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </Animated.View>

        <Animated.View style={[styles.inputContainer, { transform: [{ translateY: slideAnimInput2 }] }]}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </Animated.View>

        <Animated.View style={[styles.inputContainer, { transform: [{ translateY: slideAnimInput3 }] }]}>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: slideAnimButton }] }]}>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.linkContainer, { transform: [{ translateY: slideAnimLink }] }]}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </Animated.View>

        <Modal
          transparent
          visible={modalVisible}
          animationType="none"
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  opacity: modalAnim,
                  transform: [{ scale: modalAnim }],
                },
              ]}
            >
              <Text style={[styles.modalTitle, modalType === 'success' ? styles.modalSuccess : styles.modalError]}>
                {modalType === 'success' ? 'Success' : 'Error'}
              </Text>
              <Text style={styles.modalMessage}>{modalMessage}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </View>
  );
}