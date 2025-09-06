import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#e0e7ff', // Fallback background color
  },
  gradient: {
    ...StyleSheet.absoluteFillObject, // Fills the entire container
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1e1b4b',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 10,
    fontWeight: '400',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    padding: 20,
    borderRadius: 20,
    fontSize: 16,
    color: '#0f172a',
    // Neumorphic shadows
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    // Gradient border effect using background
    borderRadius: 20,
    // Inner shadow for neumorphism
    shadowColorInner: '#ffffff',
    shadowOffsetInner: { width: -4, height: -4 },
    shadowOpacityInner: 0.2,
    shadowRadiusInner: 8,
  },
  inputError: {
    borderColor: '#e11d48',
    borderWidth: 2,
    shadowOpacity: 0.25,
  },
  errorText: {
    color: '#e11d48',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 8,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#4f46e5',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    // Glow effect
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
    backgroundColor: '#818cf8',
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  linkContainer: {
    alignItems: 'center',
  },
  link: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
    opacity: 0.9,
  },
  // Modal styles for modern alert replacement
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    // Neumorphic shadows
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    shadowColorInner: '#ffffff',
    shadowOffsetInner: { width: -4, height: -4 },
    shadowOpacityInner: 0.2,
    shadowRadiusInner: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalSuccess: {
    color: '#10b981',
  },
  modalError: {
    color: '#e11d48',
  },
  modalMessage: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    // Glow effect
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});