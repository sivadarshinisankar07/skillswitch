import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    marginTop: 25,
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#667eea',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  backButton: {
    padding: 8,
  },
  
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  
  headerTitle: {
    marginTop: 5,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  
  placeholder: {
    width: 40,
  },
  
  keyboardView: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: 30,
  },
  
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  
  profilePicContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#667eea',
  },
  
  cameraOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#667eea',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  
  cameraIcon: {
    fontSize: 16,
  },
  
  profileHint: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  
  fieldContainer: {
    marginBottom: 24,
  },
  
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  
  labelCount: {
    color: '#667eea',
    fontWeight: '500',
  },
  
  inputContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  
  disabledInput: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    marginTop: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 1001,
    maxHeight: 200,
  },
  
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  
  dropdownText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  
  addIcon: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: '700',
  },
  
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#ddd6fe',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c4b5fd',
  },
  
  learnSkillTag: {
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
  },
  
  skillTagText: {
    color: '#5b21b6',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 6,
  },
  
  learnSkillTagText: {
    color: '#92400e',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 6,
  },
  
  removeIcon: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '700',
  },
  
  saveButton: {
    backgroundColor: '#667eea',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    elevation: 4,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  saveButtonDisabled: {
    backgroundColor: '#94a3b8',
    elevation: 0,
    shadowOpacity: 0,
  },
  
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  
  // Modal Overlay and Base Container
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  
  modalContainer: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: '90%',
    minWidth: 280,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  
  // Success Modal Styles
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  successIconText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  modalMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Validation and Error Styles
  required: {
    color: '#ff4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  
  errorBorder: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  // Error Modal Styles
  errorModalContainer: {
    maxHeight: '80%',
    maxWidth: '85%',
    minWidth: 300,
  },

  errorIcon: {
    backgroundColor: '#ff4757',
  },

  errorIconText: {
    color: '#ffffff',
  },

  errorModalTitle: {
    color: '#ff4757',
    textAlign: 'center',
    marginBottom: 16,
  },

  errorListContainer: {
    maxHeight: 180,
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 4,
  },

  errorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingHorizontal: 2,
  },

  errorBullet: {
    fontSize: 14,
    color: '#ff4757',
    marginRight: 6,
    marginTop: 1,
    lineHeight: 18,
  },

  errorMessage: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    lineHeight: 18,
  },

  errorModalButton: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
    minWidth: 100,
  },

  errorModalButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});