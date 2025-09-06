import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
  
  content: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,

  },

  messageContainer: {
    marginVertical: 4,
    maxWidth: width * 0.8,
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  myMessageBubble: {
    backgroundColor: '#667EEA',
    borderBottomRightRadius: 6,
  },
  otherMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    opacity: 0.7,
  },
  myMessageTime: {
    color: '#667EEA',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#6B7280',
    textAlign: 'left',
  },
  fileContainer: {
    minWidth: 200,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopLeftRadius: 12,
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  myFileIcon: {
    backgroundColor: '#EEF2FF',
  },
  otherFileIcon: {
    backgroundColor: '#F0F9FF',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    fontWeight: '400',
  },
  typingContainer: {
    paddingHorizontal: 16,
    marginTop:10
  },
  typingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: width * 0.6,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#667EEA',
    marginHorizontal: 2,
  },
  uploadContainer: {
    position: 'absolute',
    top: '45%',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  uploadBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  uploadContent: {
    padding: 20,
    alignItems: 'center',
  },
  uploadProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  uploadProgressFill: {
    height: '100%',
    backgroundColor: '#667EEA',
    borderRadius: 3,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  inputBlur: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 12 : 12,
  },
  attachButton: {
    marginRight: 8,
    marginBottom: 4,
  },
  attachGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButtonDisabled: {
    opacity: 0.5,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  sendButton: {
    marginLeft: 8,
    marginBottom: 4,
  },
  sendGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});