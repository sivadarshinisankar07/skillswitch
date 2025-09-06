import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
} from 'react-native';

const { width } = Dimensions.get('window');

const ModernModal = ({
  visible,
  onClose,
  title,
  message,
  type = 'info',
  buttons = [{ text: 'OK', onPress: onClose, primary: true }],
  variant = 'modern', // 'modern', 'glass', 'dark'
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Entry animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Icon bounce animation
      setTimeout(() => {
        Animated.sequence([
          Animated.spring(bounceAnim, {
            toValue: 1,
            tension: 200,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 0,
            tension: 200,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }, 200);
    } else {
      // Exit animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [visible, onClose]);

  const getIconForType = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'question': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getHeaderStyle = () => {
    const baseStyle = styles.modalHeader;
    switch (type) {
      case 'success':
        return [baseStyle, styles.modalHeaderSuccess];
      case 'error':
        return [baseStyle, styles.modalHeaderError];
      case 'warning':
        return [baseStyle, styles.modalHeaderWarning];
      default:
        return baseStyle;
    }
  };

  const getContainerStyle = () => {
    switch (variant) {
      case 'glass':
        return styles.modalContainerGlass;
      case 'dark':
        return styles.modalContainerDark;
      default:
        return styles.modalContainer;
    }
  };

  const renderButton = (button, index) => {
    const isLast = index === buttons.length - 1;
    const isPrimary = button.primary;
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.modalButton,
          isPrimary ? styles.modalButtonPrimary : styles.modalButtonSecondary,
          buttons.length === 1 && styles.modalButtonFloating,
          !isLast && styles.modalButtonBorder,
        ]}
        onPress={button.onPress}
        activeOpacity={0.8}
        // Add press animation
        onPressIn={() => {
          Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }}
      >
        <Text
          style={[
            styles.modalButtonText,
            isPrimary && styles.modalButtonTextPrimary,
            buttons.length === 1 && styles.modalButtonFloatingText,
          ]}
        >
          {button.text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            opacity: opacityAnim,
          },
        ]}
      >

        
        <Animated.View
          style={[
            getContainerStyle(),
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Header with Gradient Background */}
          <View style={getHeaderStyle()}>
            <Animated.Text
              style={[
                styles.modalIcon,
                {
                  transform: [
                    {
                      scale: bounceAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              {getIconForType()}
            </Animated.Text>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>

          {/* Body */}
          <View style={variant === 'glass' ? styles.modalBodyGlass : styles.modalBody}>
            <Text style={styles.modalMessage}>{message}</Text>
          </View>

          {/* Footer with Buttons */}
          <View
            style={[
              styles.modalFooter,
              buttons.length === 1 && styles.modalFooterSingle,
              buttons.length > 2 && styles.modalFooterMultiple,
            ]}
          >
            {buttons.map(renderButton)}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// Complete styles object
const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  modalContainerGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 28,
    width: '90%',
    maxWidth: 340,
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 30,
  },

  modalContainerDark: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 28,
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 25,
  },

  modalHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },

  modalHeaderSuccess: {
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    shadowColor: '#11998e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },

  modalHeaderError: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },

  modalHeaderWarning: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    shadowColor: '#f093fb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },

  modalHeaderGlass: {
    backgroundColor: 'transparent',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  modalIcon: {
    fontSize: 42,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  modalTitle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  modalBody: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  modalBodyGlass: {
    padding: 24,
    backgroundColor: 'transparent',
  },

  modalMessage: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    marginBottom: 8,
  },

  modalFooter: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  modalFooterSingle: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    padding: 16,
  },

  modalFooterMultiple: {
    flexDirection: 'column',
    backgroundColor: '#F9FAFB',
  },

  modalButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  modalButtonSecondary: {
    backgroundColor: '#6366F1',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  modalButtonPrimary: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },

  modalButtonFloating: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginHorizontal: 0,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  modalButtonBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  modalButtonTextPrimary: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  modalButtonFloatingText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },
};

export default ModernModal;
