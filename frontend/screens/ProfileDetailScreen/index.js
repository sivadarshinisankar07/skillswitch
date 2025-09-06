import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
  Modal,
  ActivityIndicator,
  Animated,
  StatusBar,
  SafeAreaView
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BACKEND } from "../../api";
import styles from "./style";

const { width: screenWidth } = Dimensions.get("window");

export default function ProfileDetail({ route, navigation }) {
  const { userId,showRequestButton = true } = route.params;
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [requestStatus, setRequestStatus] = useState("none");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });
  const [fadeAnim] = useState(new Animated.Value(0));

  const loadData = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = JSON.parse(storedUser || "{}");
      setCurrentUser(parsedUser);

      // Load profile
      const { data } = await axios.get(`${API_BACKEND}/api/profile/${userId}`);
      setProfile(data);

      // Load request status
      if (parsedUser?._id) {
        const res = await axios.get(
          `${API_BACKEND}/api/requests/status/${parsedUser._id}/${userId}`
        );
        setRequestStatus(res.data.status);
      }
    } catch (error) {
      showModal("Error", "Failed to load profile data", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
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

  const sendRequest = async () => {
    try {
      await axios.post(`${API_BACKEND}/api/requests`, {
        fromUser: currentUser?._id,
        toUser: userId,
      });
      showModal(
        "Success",
        "Your learn request was sent successfully!",
        "success"
      );
      setRequestStatus("pending");
    } catch (e) {
      showModal(
        "Error",
        e?.response?.data?.message || "Could not send request",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingTitle}>Loading Profile</Text>
          <Text style={styles.loadingSubtitle}>
            Please wait while we fetch the profile data...
          </Text>
        </View>
      </View>
    );
  }

  return (
       <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" backgroundColor="#667eea" />
         <View style={styles.header}>
           <TouchableOpacity
             onPress={() => navigation.goBack()}
             style={styles.backButton}
           >
             <Text style={styles.backButtonText}>←</Text>
           </TouchableOpacity>
           <Text style={styles.headerTitle}>Profile</Text>
           <View style={styles.placeholder} />
         </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[styles.animatedContainer, { opacity: fadeAnim }]}
        >
          {/* Profile Header Section */}
          <View style={styles.profileHeader}>
            <View style={styles.profilePicWrapper}>
              {profile?.profilePic ? (
                <View style={styles.profilePicContainer}>
                  <Image
                    source={{ uri: `${API_BACKEND}${profile.profilePic}` }}
                    style={styles.profilePic}
                  />
                </View>
              ) : (
                <View style={[styles.profilePic, styles.profilePicPlaceholder]}>
                  <Text style={styles.profilePicPlaceholderText}>
                    {profile?.userId.name?.charAt(0)?.toUpperCase() ||
                      profile?.designation?.charAt(0)?.toUpperCase() ||
                      "?"}
                  </Text>
                </View>
              )}
              <View style={styles.onlineIndicator} />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profile?.userId.name || "No name specified"}
              </Text>

              <Text style={styles.designation}>
                {profile?.designation || "No designation specified"}
              </Text>

              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Available to mentor</Text>
              </View>
            </View>
          </View>

          {/* Profile Information Cards */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Personal Information</Text>

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>🎂</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Age</Text>
                  <Text style={styles.infoValue}>
                    {profile?.age ? `${profile.age} years` : "Not specified"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>🎓</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Qualification</Text>
                  <Text style={styles.infoValue}>
                    {profile?.qualification || "Not specified"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Skills & Learning</Text>

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>⭐</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Skills</Text>
                  <View style={styles.skillsContainer}>
                    {profile?.skills?.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <View key={index} style={styles.skillChip}>
                          <Text style={styles.skillChipText}>{skill}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.infoValue}>None listed</Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>🎯</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Wants to Learn</Text>
                  <View style={styles.skillsContainer}>
                    {profile?.skillsToLearn?.length > 0 ? (
                      profile.skillsToLearn.map((skill, index) => (
                        <View key={index} style={styles.learningChip}>
                          <Text style={styles.learningChipText}>{skill}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.infoValue}>None listed</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {showRequestButton && (
          <View style={styles.buttonContainer}>
            {requestStatus === "none" && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={sendRequest}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>
                  📚 Send Learn Request
                </Text>
              </TouchableOpacity>
            )}

            {requestStatus === "pending" && (
              <View style={styles.statusButton}>
                <ActivityIndicator
                  size="small"
                  color="#F59E0B"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.statusButtonText}>Request Pending</Text>
              </View>
            )}

            {requestStatus === "accepted" && (
              <>
                <View style={styles.acceptedButton}>
                  <Text style={styles.acceptedButtonText}>
                    ✅ Request Accepted
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate("ChatScreen", { userId })}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>
                    💬 Start Conversation
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Modern Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalHeader,
                modalContent.type === "success" && styles.modalHeaderSuccess,
                modalContent.type === "error" && styles.modalHeaderError,
              ]}
            >
              <Text style={styles.modalIcon}>
                {modalContent.type === "success"
                  ? "✅"
                  : modalContent.type === "error"
                  ? "❌"
                  : "ℹ️"}
              </Text>
              <Text style={styles.modalTitle}>{modalContent.title}</Text>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>{modalContent.message}</Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
