import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Animated } from 'react-native';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import styles from './style';
import { API_BACKEND } from '../../api';

export default function OtpVerificationScreen({ route, navigation }) {
  const { email } = route.params || {};
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [busy, setBusy] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const timerRef = useRef(null);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const resendButtonScale = useRef(new Animated.Value(1)).current;

  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnimHeader = useRef(new Animated.Value(-50)).current;
  const slideAnimInput = useRef(new Animated.Value(50)).current;
  const slideAnimButton = useRef(new Animated.Value(50)).current;
  const slideAnimLink = useRef(new Animated.Value(50)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startTimer();
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
      Animated.timing(slideAnimInput, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimButton, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimLink, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
    return () => stopTimer();
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

  const startTimer = () => {
    setTimeLeft(60);
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const validateOtp = () => {
    if (!otp || otp.length < 4) {
      setModalType('error');
      setModalMessage('Please enter a valid OTP (at least 4 digits).');
      setModalVisible(true);
      return false;
    }
    return true;
  };

  const handleVerify = async () => {
    if (!validateOtp()) return;

    setBusy(true);
    try {
      const res = await axios.post(`${API_BACKEND}/api/auth/verify-otp`, { email, otp });
      setModalType('success');
      setModalMessage(res.data.message || 'Verified successfully!');
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('Login');
      }, 2000);
    } catch (err) {
      const errorMsg = err?.response?.data?.error || 'Verification failed';
      setModalType('error');
      setModalMessage(errorMsg);
      setModalVisible(true);
      console.log(err?.response?.data || err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    setResendLoading(true);
    try {
      const res = await axios.post(`${API_BACKEND}/api/auth/resend-otp`, { email });
      setModalType('success');
      setModalMessage(res.data.message || 'OTP resent to email.');
      setModalVisible(true);
      startTimer();
    } catch (err) {
      const errorMsg = err?.response?.data?.error || 'Resend failed';
      setModalType('error');
      setModalMessage(errorMsg);
      setModalVisible(true);
      console.log(err?.response?.data || err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        const m = text.match(/(\d{4,6})/);
        if (m && m[1]) {
          setOtp(m[1]);
        } else {
          setModalType('error');
          setModalMessage('No OTP found in clipboard');
          setModalVisible(true);
        }
      }
    } catch (e) {
      console.log('Clipboard error', e);
      setModalType('error');
      setModalMessage('Failed to access clipboard');
      setModalVisible(true);
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

  const handleResendPressIn = () => {
    Animated.spring(resendButtonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleResendPressOut = () => {
    Animated.spring(resendButtonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const formattedTimer = () => {
    const s = timeLeft % 60;
    const mm = Math.floor(timeLeft / 60);
    return `${mm}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
      <View style={styles.container}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnimHeader }] }]}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to {email}</Text>
        </Animated.View>

        <Animated.View style={[styles.inputContainer, { transform: [{ translateY: slideAnimInput }] }]}>
          <TextInput
            style={[styles.input, otp.length < 4 && otp !== '' ? styles.inputError : null]}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
            textContentType="oneTimeCode"
          />
        </Animated.View>

        <Animated.View style={[styles.linkContainer, { transform: [{ translateY: slideAnimLink }] }]}>
          <TouchableOpacity onPress={pasteFromClipboard}>
            <Text style={styles.link}>Paste OTP from clipboard</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.timerContainer, { transform: [{ translateY: slideAnimLink }] }]}>
          <Text style={styles.timerText}>
            {timeLeft > 0 ? `Expires in ${formattedTimer()}` : 'You can resend the code now.'}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: slideAnimButton }] }]}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.button, { opacity: busy ? 0.7 : 1 }]}
              onPress={handleVerify}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              disabled={busy}
            >
              <Text style={styles.buttonText}>{busy ? 'Verifying...' : 'Verify'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.linkContainer, { transform: [{ translateY: slideAnimLink }] }]}>
          <Animated.View style={{ transform: [{ scale: resendButtonScale }] }}>
            <TouchableOpacity
              onPress={handleResend}
              disabled={timeLeft > 0 || resendLoading}
              onPressIn={handleResendPressIn}
              onPressOut={handleResendPressOut}
            >
              <Text style={[styles.link, timeLeft > 0 ? styles.resendDisabled : null]}>
                {resendLoading ? 'Resending...' : timeLeft > 0 ? `Resend in ${formattedTimer()}` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.linkContainer, { transform: [{ translateY: slideAnimLink }] }]}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Back to Register</Text>
          </TouchableOpacity>
        </Animated.View>

        <Modal transparent visible={modalVisible} animationType="none">
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContainer, { opacity: modalAnim, transform: [{ scale: modalAnim }] }]}>
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