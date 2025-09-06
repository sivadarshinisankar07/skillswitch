import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Color palette
const colors = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#F3F4F6',
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  cardBackground: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  shadow: '#000000',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  accent: '#8B5CF6',
  accentLight: '#EDE9FE',
};

// Typography
const typography = {
  fontFamily: 'System',
  heading: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
};

// Spacing
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Shadows
const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6.27,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12.84,
    elevation: 8,
  },
};

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
    flexGrow: 1,
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  animatedContainer: {
    flex: 1,
  },

  // Modern Loading Container
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.xl,
  },

  loadingCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.medium,
    width: screenWidth * 0.8,
    maxWidth: 300,
  },

  loadingTitle: {
    ...typography.subheading,
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
  },

  loadingSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Profile header section
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },

  profilePicWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },

  profilePicContainer: {
    position: 'relative',
    marginRight: spacing.base
  },

  profilePic: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: colors.background,
  },

  profilePicPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profilePicPlaceholderText: {
    color: colors.background,
    fontSize: 56,
    fontWeight: '800',
  },

onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 20,
    width: 18,
    height: 18,
    top:129,
    borderRadius: 10,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.border,
  },

  profileInfo: {
    alignItems: 'center',
  },

  profileName: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  designation: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },

  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: colors.success,
    borderRadius: 4,
    marginRight: spacing.sm,
  },

  statusText: {
    ...typography.small,
    color: colors.success,
    fontWeight: '600',
  },

  // Information section
  infoSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  infoCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: spacing.lg,
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
    fontSize: 18,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },

  infoIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: colors.primaryLight + '20',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  infoIcon: {
    fontSize: 20,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  infoValue: {
    ...typography.body,
    color: colors.text,
  },

  // Skills containers
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  skillChip: {
    backgroundColor: colors.primary + '15',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  skillChipText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },

  learningChip: {
    backgroundColor: colors.accent + '15',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  learningChipText: {
    ...typography.small,
    color: colors.accent,
    fontWeight: '600',
  },

  // Button container
  buttonContainer: {
    gap: spacing.md,
    marginTop: spacing.md,
  },

  // Primary button
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
    minHeight: 56,
  },

  primaryButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '700',
    fontSize: 16,
  },

  // Secondary button
  secondaryButton: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    minHeight: 56,
    ...shadows.small,
  },

  secondaryButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },

  // Status button (Request Pending)
  statusButton: {
    backgroundColor: colors.warningLight,
    borderRadius: 16,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.warning + '30',
    minHeight: 56,
  },

  statusButtonText: {
    ...typography.body,
    color: colors.warning,
    fontWeight: '600',
    fontSize: 16,
  },

  // Accepted button
  acceptedButton: {
    backgroundColor: colors.successLight,
    borderRadius: 16,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.success + '30',
    minHeight: 56,
  },

  acceptedButtonText: {
    ...typography.body,
    color: colors.success,
    fontWeight: '700',
    fontSize: 16,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },

  modalContainer: {
    backgroundColor: colors.background,
    borderRadius: 24,
    width: '100%',
    maxWidth: 320,
    ...shadows.large,
    overflow: 'hidden',
  },

  modalHeader: {
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  modalHeaderSuccess: {
    backgroundColor: colors.successLight,
  },

  modalHeaderError: {
    backgroundColor: colors.errorLight,
  },

  modalIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },

  modalTitle: {
    ...typography.subheading,
    color: colors.text,
    textAlign: 'center',
  },

  modalBody: {
    padding: spacing.lg,
  },

  modalMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  modalButton: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
  },

  modalButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },

  // Responsive adjustments
  '@media (max-width: 380)': {
    profilePic: {
      width: 140,
      height: 140,
      borderRadius: 70,
    },

    profilePicContainer: {
      borderRadius: 75,
    },

    profileName: {
      fontSize: 24,
      lineHeight: 30,
    },

    scrollContent: {
      padding: spacing.sm,
      paddingBottom: spacing.xl,
    },

    infoCard: {
      padding: spacing.md,
      borderRadius: 16,
    },

    infoRow: {
      marginBottom: spacing.sm,
    },

    loadingCard: {
      width: screenWidth * 0.85,
      padding: spacing.lg,
    },

    modalContainer: {
      maxWidth: screenWidth - spacing.xl,
    },
  },
});