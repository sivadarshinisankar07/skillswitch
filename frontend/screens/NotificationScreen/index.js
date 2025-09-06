import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Modal, 
  TouchableOpacity, 
  SafeAreaView,
  Animated,
  StatusBar,
  RefreshControl,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BACKEND } from '../../api';
import { styles } from './style';

export default function NotificationsScreen() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const modalScale = new Animated.Value(0);
  const modalOpacity = new Animated.Value(0);

  const load = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    setLoading(true);
    
    try {
      const u = JSON.parse((await AsyncStorage.getItem('user')) || '{}');
      setUserId(u._id);
      
      if (!u?._id) return;
      
      const { data } = await axios.get(`${API_BACKEND}/api/requests/received/${u._id}`);
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openModal = (req) => {
    // Only open modal for pending requests
    if (req.status?.toLowerCase() !== 'pending') {
      return;
    }
    
    setSelected(req);
    setVisible(true);
    
    // Reset animation values to 0 first, then animate to 1
    modalScale.setValue(0);
    modalOpacity.setValue(0);
    
    // Animate modal entrance
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    // Animate modal exit
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      setSelected(null);
    });
  };

  const accept = async () => {
    try {
      await axios.patch(`${API_BACKEND}/api/requests/${selected._id}/accept`);
      closeModal();
      load();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const reject = async () => {
    try {
      await axios.patch(`${API_BACKEND}/api/requests/${selected._id}/reject`);
      closeModal();
      load();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const onRefresh = () => {
    load(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return styles.statusPending;
      case 'accepted':
        return styles.statusAccepted;
      case 'rejected':
        return styles.statusRejected;
      default:
        return styles.statusDefault;
    }
  };

  const handleRequestPress = (item) => {
    // Only open modal for pending requests
    // For accepted/rejected requests, you can add different logic here if needed
    if (item.status?.toLowerCase() === 'pending') {
      openModal(item);
    }
    // For non-pending requests, you could navigate to a detail view or do nothing
  };

  const renderRequestItem = ({ item, index }) => (
    <Animated.View 
      style={[
        styles.requestCard,
        {
          opacity: 1,
          transform: [
            {
              translateY: 0,
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => handleRequestPress(item)}
        style={[
          styles.requestContent,
          // Optionally, you can add different styles for non-pending requests
          item.status?.toLowerCase() !== 'pending' && { opacity: 0.7 }
        ]}
        activeOpacity={item.status?.toLowerCase() === 'pending' ? 0.7 : 1}
        disabled={item.status?.toLowerCase() !== 'pending'} // Disable touch for non-pending
      >
        <View style={styles.requestHeader}>
          <View style={styles.userInfo}>
      <View style={styles.avatarContainer}>
        {item.fromUser?.profilePic ? (
          <Image
            source={{ uri: `${API_BACKEND}${item.fromUser.profilePic}` }}
            style={styles.avatarImage}
            defaultSource={require("../../assets/front.jpg")}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
      <Text style={styles.avatarText}>
        {(item.fromUser?.name || 'U').charAt(0).toUpperCase()}
      </Text>
          </View>
        )}
        <View style={styles.onlineIndicator} />
      </View>
            <View style={styles.requestDetails}>
              <Text style={styles.userName}>
                {item.fromUser?.name || 'Unknown User'}
              </Text>
              <Text style={styles.requestTime}>
                {new Date(item.createdAt || Date.now()).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, getStatusColor(item.status)]}>
            <Text style={styles.statusText}>
              {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Pending'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.requestMessage}>
          Learning request from {item.fromUser?.name || 'user'}
          {item.status?.toLowerCase() === 'pending' && ' - Tap to respond'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content"  backgroundColor="#667eea"/>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Requests</Text>
        <Text style={styles.headerSubtitle}>
          {requests.length} {requests.length === 1 ? 'request' : 'requests'}
        </Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={renderRequestItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No requests yet</Text>
            <Text style={styles.emptySubtitle}>
              When someone sends you a learning request, it will appear here
            </Text>
          </View>
        }
      />

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={closeModal}
          />
          
          <Animated.View
            style={[
              styles.modalContainer
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Accept Learning Request?</Text>
              <Text style={styles.modalSubtitle}>
                {selected?.fromUser?.name} wants to learn from you
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={accept}
                style={[styles.modalButton, styles.acceptButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={reject}
                style={[styles.modalButton, styles.rejectButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.rejectButtonText}>Decline</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={closeModal}
              style={styles.cancelButton}
              activeOpacity={0.6}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}