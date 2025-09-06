import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Modal,
  ActivityIndicator,
  Animated,
  StatusBar,
  AppState,
  BackHandler,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BACKEND } from "../../api";
import styles from "./style";
import ModernModal from "./Modal";

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [exitModalVisible, setExitModalVisible] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState("matches"); // "matches" or "suggestions"
  const [tabAnimation] = useState(new Animated.Value(0)); // 0 = matches, 1 = suggestions

  const loadMatches = useCallback(async (userId) => {
    try {
      const { data } = await axios.get(
        `${API_BACKEND}/api/profile/matching/${userId}`
      );
      setMatches(data);
    } catch (error) {
      console.log("Error loading matches:", error);
      showModal("Error", "Failed to load matches. Please try again.", "error");
    }
  }, []);

  const loadAllProfiles = useCallback(async (userId) => {
    try {
      const { data } = await axios.get(
        `${API_BACKEND}/api/profile/all/${userId}`
      );
      setAllProfiles(data);
    } catch (error) {
      console.log("Error loading all profiles:", error);
      showModal("Error", "Failed to load suggestions. Please try again.", "error");
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      const userData = JSON.parse(userStr || "{}");
      setUser(userData);

      if (userData._id) {
        // Load both matches and all profiles
        await Promise.all([
          loadMatches(userData._id),
          loadAllProfiles(userData._id)
        ]);
      }
    } catch (error) {
      console.log("Error in loadData:", error);
      showModal("Error", "Failed to load data. Please try again.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loadMatches, loadAllProfiles]);

  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused() && navigation.canGoBack() === false) {
        setExitModalVisible(true);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        setExitModalVisible(false);
      }
    });

    return () => {
      backHandler.remove();
      subscription.remove();
    };
  }, [navigation]);

  const confirmExit = () => {
    setExitModalVisible(false);
    setTimeout(() => {
      BackHandler.exitApp();
    }, 150);
  };

  const cancelExit = () => {
    setExitModalVisible(false);
  };

  useEffect(() => {
    loadData();

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const showModal = (title, message, type = "info") => {
    setModalContent({ title, message, type });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    
    setActiveTab(tab);
    const toValue = tab === "suggestions" ? 1 : 0;
    
    Animated.timing(tabAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const renderMatchCard = ({ item, index }) => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [
        {
          translateY: slideAnim.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 50],
          }),
        },
      ],
    };

    return (
      <Animated.View style={[animatedStyle, { marginTop: index * 2 }]}>
        <TouchableOpacity
          style={styles.matchCard}
          onPress={() =>
            navigation.navigate("ProfileDetail", { userId: item.userId?._id, showRequestButton: activeTab === "matches", })
          }
          activeOpacity={0.8}
        >
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            {item.profilePic ? (
              <Image
                source={{ uri: `${API_BACKEND}${item.profilePic}` }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>
                  {item.userId.name?.charAt(0)?.toUpperCase() ||
                    item.designation?.charAt(0)?.toUpperCase() ||
                    "?"}
                </Text>
              </View>
            )}
            <View style={styles.onlineDot} />
          </View>

          {/* Content */}
          <View style={styles.matchContent}>
            <View style={styles.matchHeader}>
              <Text style={styles.matchName} numberOfLines={1}>
                {item.userId.name || "Unknown User"}
              </Text>
              <View style={[
                styles.expertBadge,
                activeTab === "matches" ? styles.expertBadge : styles.suggestedBadge
              ]}>
                <Text style={[
                  styles.expertBadgeText,
                  activeTab === "suggestions" && styles.suggestedBadgeText
                ]}>
                  {activeTab === "matches" ? "Expert" : "Suggested"}
                </Text>
              </View>
            </View>

            <Text style={styles.matchDesignation} numberOfLines={1}>
              {item.designation || "No designation"}
            </Text>

            <View style={styles.skillsSection}>
              <Text style={styles.skillsLabel}>Skills:</Text>
              <View style={styles.skillsContainer}>
                {item.skills?.slice(0, 3).map((skill, skillIndex) => (
                  <View key={skillIndex} style={styles.skillChip}>
                    <Text style={styles.skillChipText}>{skill}</Text>
                  </View>
                ))}
                {item.skills?.length > 3 && (
                  <View style={styles.moreSkillsChip}>
                    <Text style={styles.moreSkillsText}>
                      +{item.skills.length - 3}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => {
    const isMatches = activeTab === "matches";
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateIcon}>
          {isMatches ? "🔍" : "👥"}
        </Text>
        <Text style={styles.emptyStateTitle}>
          {isMatches ? "No Matches Found" : "No Suggestions Available"}
        </Text>
        <Text style={styles.emptyStateMessage}>
          {isMatches 
            ? "We couldn't find any learning matches for you right now. Try updating your profile or check back later!"
            : "No other profiles available at the moment. Check back later for new suggestions!"
          }
        </Text>
        {isMatches && (
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.emptyStateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getCurrentData = () => {
    return activeTab === "matches" ? matches : allProfiles;
  };

  const getCurrentCount = () => {
    const data = getCurrentData();
    return data.length;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#667eea" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingTitle}>Loading Your Dashboard</Text>
            <Text style={styles.loadingSubtitle}>
              We're preparing your matches and suggestions...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#667eea"/>

      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>{getTimeOfDay()}</Text>
          <Text style={styles.userName}>{user?.name || "Guest"}! 👋</Text>
          <Text style={styles.subtitle}>
            Ready to learn something new today?
          </Text>
        </View>
      </Animated.View>

      {/* Tab Navigation */}
      <Animated.View style={[styles.tabContainer, { opacity: fadeAnim }]}>
        <View style={styles.tabWrapper}>
          {/* Tab Indicator */}
          <Animated.View 
            style={[
              styles.tabIndicator,
              {
                left: tabAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['2%', '52%'],
                }),
              }
            ]} 
          />
          
          {/* Tab Buttons */}
          <TouchableOpacity
            style={[styles.tab, activeTab === "matches" && styles.activeTab]}
            onPress={() => switchTab("matches")}
          >
            <Text style={[
              styles.tabText,
              activeTab === "matches" && styles.activeTabText
            ]}>
              🎯 Skill Matching
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === "suggestions" && styles.activeTab]}
            onPress={() => switchTab("suggestions")}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.tabText,
              activeTab === "suggestions" && styles.activeTabText
            ]}>
              💡 Suggestions
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View style={[styles.sectionHeader, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>
            {activeTab === "matches" ? "🎯 Perfect Matches for You" : "💡 Discover New Mentors"}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {getCurrentCount()} {getCurrentCount() === 1 ? "mentor" : "mentors"} available
          </Text>
        </Animated.View>

        <FlatList
          data={getCurrentData()}
          keyExtractor={(item) => String(item.userId._id || item.userId)}
          renderItem={renderMatchCard}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6366F1"]}
              tintColor="#6366F1"
              title="Pull to refresh"
              titleColor="#6B7280"
            />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContainer,
            getCurrentData().length === 0 && styles.emptyListContainer,
          ]}
        />
      </View>

      <ModernModal
        visible={modalVisible}
        onClose={closeModal}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        variant="modern"
      />

      <ModernModal
        visible={exitModalVisible}
        onClose={cancelExit}
        title="Exit App"
        message="Are you sure you want to exit?"
        type="question"
        buttons={[
          {
            text: "Stay",
            onPress: cancelExit,
            primary: false,
          },
          {
            text: "Exit",
            onPress: confirmExit,
            primary: true,
          },
        ]}
      />
    </SafeAreaView>
  );
}