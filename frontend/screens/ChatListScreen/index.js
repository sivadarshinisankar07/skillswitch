import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  StatusBar,
  Platform,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BACKEND } from "../../api";
import styles from "./style";

export default function ChatListScreen({ navigation }) {
  const [partners, setPartners] = useState([]);
  const [current, setCurrent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const u = JSON.parse((await AsyncStorage.getItem("user")) || "{}");
      setCurrent(u);
      if (!u?._id) return;

      const { data } = await axios.get(
        `${API_BACKEND}/api/requests/accepted/${u._id}`
      );
      
      // Ensure each partner has a unique identifier
      const partnersWithIds = data.map((partner, index) => ({
        ...partner,
        // Create a unique ID if not present
        uniqueId: partner._id || 
                  partner.userId?._id || 
                  partner.userId || 
                  `partner-${index}-${Date.now()}`,
      }));
      
      setPartners(partnersWithIds);
      setFilteredPartners(partnersWithIds);
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filterChats = useCallback((query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPartners(partners);
    } else {
      const filtered = partners.filter(
        (partner) =>
          partner.designation?.toLowerCase().includes(query.toLowerCase()) ||
          partner.userId?.name?.toLowerCase().includes(query.toLowerCase()) ||
          partner.skills?.some((skill) =>
            skill.toLowerCase().includes(query.toLowerCase())
          )
      );
      setFilteredPartners(filtered);
    }
  }, [partners]);

  const getInitials = useCallback((designation) => {
    if (!designation) return "?";
    return designation
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const getTimeAgo = useCallback((updatedAt) => {
    if (!updatedAt) return "Just now";

    const now = new Date();
    const updated = new Date(updatedAt);
    const diffMs = now - updated;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return updated.toLocaleDateString();
  }, []);

  const handleChatPress = useCallback((userId) => {
    // Extract the actual user ID if it's an object
    const actualUserId = typeof userId === 'object' ? userId._id || userId.id : userId;
    navigation.navigate("ChatScreen", { userId: actualUserId });
  }, [navigation]);

  // Fixed keyExtractor with proper unique key generation
  const keyExtractor = useCallback((item, index) => {
    // Try multiple sources for unique ID
    if (item.uniqueId) {
      return String(item.uniqueId);
    }
    if (item._id) {
      return String(item._id);
    }
    if (item.userId && typeof item.userId === 'object' && item.userId._id) {
      return String(item.userId._id);
    }
    if (item.userId && typeof item.userId !== 'object') {
      return String(item.userId);
    }
    
    // Fallback to creating a unique key
    const designation = item.designation || 'unknown';
    const timestamp = item.updatedAt || Date.now();
    return `${designation}-${timestamp}-${index}`;
  }, []);

  // Memoized renderChatItem
  const renderChatItem = useCallback(({ item, index }) => {
    // Extract userId for navigation
    const userId = typeof item.userId === 'object' ? item.userId._id || item.userId.id : item.userId;
    
    return (
      <TouchableOpacity
        style={[
          styles.chatCard,
          { marginTop: index === 0 ? 0 : styles.chatCard.marginVertical },
        ]}
        onPress={() => handleChatPress(userId)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {item.profilePic ? (
            <Image
              source={{ uri: `${API_BACKEND}${item.profilePic}` }}
              style={styles.avatarImage}
              defaultSource={require("../../assets/front.jpg")}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(item.designation)}
              </Text>
            </View>
          )}
          <View style={styles.onlineIndicator} />
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.designation} numberOfLines={1}>
              {(typeof item.userId === 'object' ? item.userId?.name : null) || 
               item.designation || 
               "Professional"}
            </Text>
            <Text style={styles.timestamp}>{getTimeAgo(item.updatedAt)}</Text>
          </View>

          <Text style={styles.skillsText} numberOfLines={1}>
            {item.skills?.length
              ? `Skills: ${item.skills.join(", ")}`
              : "No skills listed"}
          </Text>

          <Text style={styles.lastMessage} numberOfLines={1}>
            Ready to connect and collaborate...
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [handleChatPress, getInitials, getTimeAgo]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>💬</Text>
      </View>
      <Text style={styles.emptyTitle}>No Chats Yet</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? `No chats match "${searchQuery}"`
          : "Your accepted chat requests will appear here"}
      </Text>
    </View>
  ), [searchQuery]);

  // Memoized FlatList props
  const flatListContentStyle = useMemo(() => [
    styles.listContainer,
    filteredPartners.length === 0 && styles.listContainerEmpty,
  ], [filteredPartners.length]);

  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={["#007AFF"]}
      tintColor="#007AFF"
      title="Pull to refresh"
      titleColor="#666666"
    />
  ), [refreshing, onRefresh]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation]);

  useEffect(() => {
    filterChats(searchQuery);
  }, [partners, filterChats, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        backgroundColor="#667eea"
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{filteredPartners.length}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={styles.searchInput.placeholderTextColor}
            value={searchQuery}
            onChangeText={filterChats}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => filterChats("")}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredPartners}
        keyExtractor={keyExtractor}
        renderItem={renderChatItem}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={flatListContentStyle}
        bounces={true}
        overScrollMode="auto"
        refreshControl={refreshControl}
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={50}
        getItemLayout={null} // Let FlatList calculate dynamically
      />
    </SafeAreaView>
  );
}