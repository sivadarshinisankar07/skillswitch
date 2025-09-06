import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './style'

const { width, height } = Dimensions.get('window');
import { API_BACKEND } from '../../api';


export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const fetchUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        setName(JSON.parse(user).name);
      }
    } catch (error) {
      console.log('Error fetching user:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(userData);
      const res = await axios.get(`${API_BACKEND}/api/profile/${parsedUser._id}`);
      if (res.data && res.data.profilePic) {
        res.data.profilePic = res.data.profilePic.startsWith('http')
          ? res.data.profilePic
          : `${API_BACKEND}${res.data.profilePic}`;
      }
      setProfile(res.data);
    } catch (err) {
      console.log('Error fetching profile:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setLogoutModalVisible(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#667eea" />
        <View style={styles.loaderContainer}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loaderText}>Loading your profile...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#667eea" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>👤</Text>
            </View>
            <Text style={styles.emptyTitle}>Welcome, {name}!</Text>
            <Text style={styles.emptySubtitle}>Let's create your profile to get started</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('EditProfile', { profile: null })}
            >
              <Text style={styles.createButtonText}>Create Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Modal */}
        <Modal
          visible={logoutModalVisible}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.logoutModal}>
              <Text style={styles.logoutModalTitle}>Confirm Logout</Text>
              <Text style={styles.logoutModalText}>Are you sure you want to logout?</Text>
              <View style={styles.logoutModalButtons}>
                <TouchableOpacity onPress={cancelLogout} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmLogout} style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#667eea" />
      
      {/* Header with Gradient Background */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View style={styles.profileCard}>
            {/* Profile Picture Section */}
            <View style={styles.profilePicSection}>
              <View style={styles.profilePicContainer}>
                <Image
                  source={profile.profilePic ? { uri: profile.profilePic } : require('../../assets/front.jpg')}
                  style={styles.profilePic}
                />
                <View style={styles.onlineIndicator} />
              </View>
            </View>

            {/* Basic Info */}
            <View style={styles.basicInfoSection}>
              <Text style={styles.profileName}>{profile.name || name || 'No Name'}</Text>
              <Text style={styles.profileDesignation}>{profile.designation || 'No Designation'}</Text>
              
              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{profile.skills?.length || 0}</Text>
                  <Text style={styles.statLabel}>Skills</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{profile.skillsToLearn?.length || 0}</Text>
                  <Text style={styles.statLabel}>Learning</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{profile.age || 'N/A'}</Text>
                  <Text style={styles.statLabel}>Age</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Personal Details</Text>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>🎓</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Qualification</Text>
                <Text style={styles.detailValue}>{profile.qualification || 'Not specified'}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>📧</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>{profile.name || name || 'Not specified'}</Text>
              </View>
            </View>
          </View>

          {/* Skills Card */}
          {profile.skills && profile.skills.length > 0 && (
            <View style={styles.skillsCard}>
              <Text style={styles.cardTitle}>
                My Skills <Text style={styles.skillCount}>({profile.skills.length})</Text>
              </Text>
              <View style={styles.skillsContainer}>
                {profile.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Learning Skills Card */}
          {profile.skillsToLearn && profile.skillsToLearn.length > 0 && (
            <View style={styles.learningCard}>
              <Text style={styles.cardTitle}>
                Learning Goals <Text style={styles.learningCount}>({profile.skillsToLearn.length})</Text>
              </Text>
              <View style={styles.skillsContainer}>
                {profile.skillsToLearn.map((skill, index) => (
                  <View key={index} style={styles.learningTag}>
                    <Text style={styles.learningText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Floating Edit Button */}
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigation.navigate('EditProfile', { profile })}
          >
            <Text style={styles.floatingButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModal}>
            <View style={styles.logoutIcon}>
              <Text style={styles.logoutIconText}>👋</Text>
            </View>
            <Text style={styles.logoutModalTitle}>Confirm Logout</Text>
            <Text style={styles.logoutModalText}>Are you sure you want to logout from your account?</Text>
            <View style={styles.logoutModalButtons}>
              <TouchableOpacity onPress={cancelLogout} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmLogout} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}