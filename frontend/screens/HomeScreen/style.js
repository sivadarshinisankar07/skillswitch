import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Color palette
const colors = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#F3F4F6',
  background: '#F9FAFB',
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
  gradient1: '#667EEA',
  gradient2: '#764BA2',
};

// Typography
const typography = {
  fontFamily: 'System',
  largeTitle: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  headline: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  callout: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  footnote: {
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
  xxxl: 48,
};

// Shadows
const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default StyleSheet.create({
  // Container
  container: {
    marginTop:28,
    flex: 1,
    backgroundColor: colors.background,
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },

  loadingCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.medium,
    width: screenWidth * 0.8,
    maxWidth: 320,
  },

  loadingTitle: {
    ...typography.headline,
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

  // Header Section
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
  },

  welcomeSection: {
    marginBottom: spacing.sm,
  },

  greeting: {
    ...typography.callout,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },

  userName: {
    ...typography.largeTitle,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },

  // Tab Container Styles
  tabContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  
  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 25,
    padding: 4,
    position: 'relative',
    height: 50,
    ...shadows.small,
  },
  
  tabIndicator: {
    position: 'absolute',
    top: 5,
    width: '46%',
    height: 40,
    borderRadius: 21,
     backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
     zIndex: 0,
  },
  
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: spacing.xs * 3,
    paddingHorizontal: spacing.md,
      zIndex: 1,
  },
  
  activeTab: {
    // Active styles are handled by the indicator
  },
  
  tabText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  activeTabText: {
    color: '#FFFFFF', 
    fontWeight: '700',

  },

  // Content Area
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  sectionHeader: {
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  sectionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  // List Container
  listContainer: {
    paddingBottom: spacing.xl,
  },

  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  // Match Cards
  matchCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.border + '40',
  },

  // Profile Image Section
  profileImageContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },

  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondary,
  },

  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImagePlaceholderText: {
    color: colors.cardBackground,
    fontSize: 24,
    fontWeight: '700',
  },

  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    backgroundColor: colors.success,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.cardBackground,
  },

  // Match Content
  matchContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },

  matchName: {
    ...typography.callout,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },

  expertBadge: {
    backgroundColor: colors.accent + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },

  expertBadgeText: {
    ...typography.footnote,
    color: colors.accent,
    fontWeight: '600',
  },

  // Badge Styles for Suggestions
  suggestedBadge: {
    backgroundColor: colors.success + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  
  suggestedBadgeText: {
    ...typography.footnote,
    color: colors.success,
    fontWeight: '600',
  },

  matchDesignation: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  // Skills Section
  skillsSection: {
    marginTop: spacing.xs,
  },

  skillsLabel: {
    ...typography.footnote,
    color: colors.textLight,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },

  skillChip: {
    backgroundColor: colors.primary + '12',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },

  skillChipText: {
    ...typography.footnote,
    color: colors.primary,
    fontWeight: '600',
  },

  moreSkillsChip: {
    backgroundColor: colors.textLight + '20',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },

  moreSkillsText: {
    ...typography.footnote,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // Arrow
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
  },

  arrow: {
    fontSize: 18,
    color: colors.textLight,
    fontWeight: '600',
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },

  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },

  emptyStateTitle: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  emptyStateMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },

  emptyStateButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    ...shadows.small,
  },

  emptyStateButtonText: {
    ...typography.callout,
    color: colors.cardBackground,
    fontWeight: '600',
  },

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: spacing.lg,
  backdropFilter: 'blur(10px)', // iOS only - creates glassmorphism effect
},

modalContainer: {
  backgroundColor: colors.cardBackground,
  borderRadius: 28,
  width: '100%',
  maxWidth: 340,
  ...shadows.large,
  overflow: 'hidden',
  transform: [{ scale: 1 }],
  elevation: 20, // Android shadow
  // Modern glassmorphism effect
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.2)',
},

modalHeader: {
  backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Gradient background
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.lg,
  alignItems: 'center',
  position: 'relative',
  // Add subtle pattern overlay
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
  },
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

modalIcon: {
  fontSize: 42,
  marginBottom: spacing.sm,
  textShadowColor: 'rgba(0, 0, 0, 0.2)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 4,
  // Add subtle bounce animation capability
  transform: [{ scale: 1 }],
},

modalTitle: {
  ...typography.headline,
  color: '#FFFFFF',
  textAlign: 'center',
  fontWeight: '700',
  fontSize: 20,
  letterSpacing: 0.5,
  textShadowColor: 'rgba(0, 0, 0, 0.3)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 2,
},

modalBody: {
  padding: spacing.xl,
  backgroundColor: colors.cardBackground,
  // Add subtle inner glow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
},

modalMessage: {
  ...typography.body,
  color: colors.textSecondary,
  textAlign: 'center',
  lineHeight: 24,
  fontSize: 16,
  marginBottom: spacing.sm,
},

modalFooter: {
  flexDirection: 'row',
  backgroundColor: colors.background,
  borderTopWidth: 0, // Remove border for cleaner look
  // Add subtle top shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
},

modalButton: {
  flex: 1,
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.lg,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  position: 'relative',
  overflow: 'hidden',
  // Add ripple effect preparation
  borderRadius: 0,
  transition: 'all 0.2s ease',
},

// Primary action button (like "Yes" or "OK")
modalButtonPrimary: {
  backgroundColor: colors.primary,
  marginHorizontal: spacing.sm,
  marginVertical: spacing.sm,
  borderRadius: 16,
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 6,
},

// Secondary action button (like "No" or "Cancel")
modalButtonSecondary: {
  backgroundColor: colors.background,
  marginHorizontal: spacing.sm,
  marginVertical: spacing.sm,
  borderRadius: 16,
  borderWidth: 2,
  borderColor: colors.border,
},

modalButtonText: {
  ...typography.callout,
  color: colors.textSecondary,
  fontWeight: '600',
  fontSize: 16,
  letterSpacing: 0.3,
},

modalButtonTextPrimary: {
  ...typography.callout,
  color: '#FFFFFF',
  fontWeight: '700',
  fontSize: 16,
  letterSpacing: 0.3,
},

// Modern alert-style variant
modalContainerAlert: {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: 24,
  width: '90%',
  maxWidth: 320,
  backdropFilter: 'blur(20px)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 20 },
  shadowOpacity: 0.15,
  shadowRadius: 25,
  elevation: 25,
},

// Floating action button style for single action modals
modalButtonFloating: {
  backgroundColor: colors.primary,
  paddingVertical: spacing.md + 2,
  paddingHorizontal: spacing.xl,
  borderRadius: 25,
  marginHorizontal: spacing.lg,
  marginBottom: spacing.lg,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.4,
  shadowRadius: 12,
  elevation: 8,
  transform: [{ scale: 1 }], // For press animations
},

modalButtonFloatingText: {
  ...typography.callout,
  color: '#FFFFFF',
  fontWeight: '700',
  fontSize: 17,
  letterSpacing: 0.5,
},

// Add these for enhanced interactivity
modalButtonPressed: {
  transform: [{ scale: 0.96 }],
  opacity: 0.8,
},

// Glassmorphism variant
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

modalHeaderGlass: {
  backgroundColor: 'transparent',
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.lg,
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(255, 255, 255, 0.1)',
},

modalBodyGlass: {
  padding: spacing.xl,
  backgroundColor: 'transparent',
},

// Dark mode variants
modalContainerDark: {
  backgroundColor: 'rgba(30, 30, 30, 0.95)',
  borderColor: 'rgba(255, 255, 255, 0.1)',
},

modalHeaderDark: {
  backgroundColor: 'rgba(20, 20, 20, 0.8)',
},

// Micro-interaction styles for press states
modalButtonHover: {
  backgroundColor: colors.primary + '20',
  transform: [{ scale: 1.02 }],
},

// Enhanced shadows for depth
enhancedShadow: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 15 },
  shadowOpacity: 0.2,
  shadowRadius: 25,
  elevation: 20,
},

  // Responsive Design
  '@media (max-width: 380)': {
    header: {
      paddingHorizontal: spacing.md,
    },

    content: {
      paddingHorizontal: spacing.md,
    },

    tabContainer: {
      marginHorizontal: spacing.md,
    },

    userName: {
      fontSize: 28,
      lineHeight: 34,
    },

    matchCard: {
      padding: spacing.md,
    },

    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },

    profileImagePlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },

    profileImagePlaceholderText: {
      fontSize: 20,
    },

    loadingCard: {
      width: screenWidth * 0.9,
      padding: spacing.lg,
    },

    modalContainer: {
      maxWidth: screenWidth - spacing.xl,
    },
  },
});