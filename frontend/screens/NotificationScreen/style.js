import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');


const spacing = {
  xs: 4,
  sm: 8,
  base: 16,
  lg: 24,
  xl: 32,
};

const colors = {
  primary: '#667eea',
  primaryLight: '#764ba2',
  background: '#f8fafc',
  surface: '#ffffff',
  text: {
    primary: '#1a202c',
    secondary: '#4a5568',
    tertiary: '#a0aec0',
  },
  accent: '#10b981',
  border: '#e2e8f0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.05)',
};

export const styles = StyleSheet.create({

  
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.border,
  },

  container: {
    flex: 1,
    marginTop:15,
    backgroundColor: '#F8F9FA',
  },
  
  // Header styles
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  
  headerSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  
  // List styles
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  
  // Request card styles
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  requestContent: {
    padding: 16,
  },
  
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  
  requestDetails: {
    flex: 1,
  },
  
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  
  requestTime: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  
  requestMessage: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 22,
  },
  
  // Status badge styles
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  statusPending: {
    backgroundColor: '#FFF3CD',
  },
  
  statusAccepted: {
    backgroundColor: '#D4EDDA',
  },
  
  statusRejected: {
    backgroundColor: '#F8D7DA',
  },
  
  statusDefault: {
    backgroundColor: '#E2E3E5',
  },
  
  // Empty state styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  emptySubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  modalContainer: {
    backgroundColor: '#FFFFFF',
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  
  modalHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  modalSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  acceptButton: {
    backgroundColor: '#28A745',
    shadowColor: '#28A745',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  
  rejectButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#DC3545',
  },
  
  rejectButtonText: {
    color: '#DC3545',
    fontSize: 18,
    fontWeight: '600',
  },
  
  cancelButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  
  cancelButtonText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '500',
  },

    avatarContainer: {
    position: 'relative',
    marginRight: spacing.base,
  },

});