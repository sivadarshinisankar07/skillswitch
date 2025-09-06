import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Image,
  Linking,
  StatusBar,
  Dimensions,
  Keyboard,
  Animated,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BACKEND } from "../../api";
import { io } from "socket.io-client";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { styles } from "./style";

const { width, height } = Dimensions.get("window");

// Memoized Message Component
const MessageItem = React.memo(
  ({
    item,
    index,
    isMyMessage,
    showTime,
    onFilePress,
    getFileIcon,
    getFullFileUrl,
    isImage,
    formatTime,
  }) => {
    const handleFilePress = useCallback(() => {
      onFilePress(item.fileUrl);
    }, [item.fileUrl, onFilePress]);

    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isMyMessage
            ? styles.myMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          {item.fileUrl ? (
            <View style={styles.fileContainer}>
              {isImage(item.fileUrl) ? (
                <TouchableOpacity
                  onPress={handleFilePress}
                  style={styles.imageContainer}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: getFullFileUrl(item.fileUrl) }}
                    style={styles.messageImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.3)"]}
                    style={styles.imageOverlay}
                  >
                    <Ionicons name="eye" size={18} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleFilePress}
                  style={styles.fileButton}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.fileIconContainer,
                      isMyMessage ? styles.myFileIcon : styles.otherFileIcon,
                    ]}
                  >
                    <Ionicons
                      name={getFileIcon(item.fileUrl)}
                      size={20}
                      color={isMyMessage ? "#667EEA" : "#4F46E5"}
                    />
                  </View>
                  <View style={styles.fileInfo}>
                    <Text
                      style={[
                        styles.fileName,
                        { color: isMyMessage ? "#1F2937" : "#374151" },
                      ]}
                      numberOfLines={1}
                    >
                      {item.fileUrl.split("/").pop()}
                    </Text>
                    <Text
                      style={[
                        styles.fileSize,
                        { color: isMyMessage ? "#6B7280" : "#9CA3AF" },
                      ]}
                    >
                      Tap to open
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Text
              style={[
                styles.messageText,
                { color: isMyMessage ? "#FFFFFF" : "#1F2937" },
              ]}
            >
              {item.body}
            </Text>
          )}
        </View>
        {showTime && (
          <Text
            style={[
              styles.messageTime,
              isMyMessage ? styles.myMessageTime : styles.otherMessageTime,
            ]}
          >
            {formatTime(item.createdAt || Date.now())}
          </Text>
        )}
      </Animated.View>
    );
  }
);

MessageItem.displayName = "MessageItem";

// Memoized Typing Indicator
const TypingIndicator = React.memo(({ typingAnimation }) => (
  <Animated.View style={[styles.typingContainer, { opacity: typingAnimation }]}>
    <View style={styles.typingBubble}>
      <View style={styles.typingDots}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.typingDot,
              {
                opacity: typingAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
                transform: [
                  {
                    scale: typingAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.8, 1.2, 0.8],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  </Animated.View>
));

TypingIndicator.displayName = "TypingIndicator";

// Memoized Upload Progress
const UploadProgress = React.memo(({ uploadProgress }) => (
  <View style={styles.uploadContainer}>
    <BlurView intensity={80} style={styles.uploadBlur}>
      <View style={styles.uploadContent}>
        <View style={styles.uploadProgressBar}>
          <Animated.View
            style={[styles.uploadProgressFill, { width: `${uploadProgress}%` }]}
          />
        </View>
        <Text style={styles.uploadText}>Uploading {uploadProgress}%</Text>
      </View>
    </BlurView>
  </View>
));

UploadProgress.displayName = "UploadProgress";

// Additional styles for performance optimization
const performanceStyles = StyleSheet.create({
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  flatListContentKeyboard: {
    paddingBottom: 100,
  },
});

export default function ChatScreen({ route, navigation }) {
  const { userId: peerId } = route.params;
  const [me, setMe] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const socketRef = useRef(null);
  const flatListRef = useRef(null);
  const inputHeight = useRef(new Animated.Value(50)).current;
  const typingAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Add a ref to track processed message IDs to prevent duplicates
  const processedMessageIds = useRef(new Set());

  // Helper function to generate unique IDs
  const generateUniqueId = useCallback(() => {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Helper function to ensure message has unique ID
  const ensureUniqueMessage = useCallback(
    (message) => {
      if (!message._id) {
        message._id = generateUniqueId();
      }
      return message;
    },
    [generateUniqueId]
  );

  // Memoized utility functions
  const isImage = useCallback((fileUrl) => {
    return fileUrl?.match(/\.(jpg|jpeg|png|gif)$/i);
  }, []);

  const getFullFileUrl = useCallback((fileUrl) => {
    return fileUrl?.startsWith("http") ? fileUrl : `${API_BACKEND}${fileUrl}`;
  }, []);

  const getFileIcon = useCallback((fileName) => {
    const ext = fileName?.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return "document-text";
      case "doc":
      case "docx":
        return "document";
      default:
        return "document";
    }
  }, []);

  const formatTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  const getMimeType = useCallback((fileName) => {
    const ext = fileName?.split(".").pop().toLowerCase();
    const mimeTypes = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
    };
    return mimeTypes[ext] || "application/octet-stream";
  }, []);

  const handleFilePress = useCallback(
    async (fileUrl) => {
      try {
        const fullUrl = getFullFileUrl(fileUrl);
        const supported = await Linking.canOpenURL(fullUrl);
        if (supported) {
          await Linking.openURL(fullUrl);
        } else {
          Alert.alert("Error", "Cannot open this file type");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to open file");
      }
    },
    [getFullFileUrl]
  );

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  // Fixed keyExtractor with better uniqueness guarantee
  const keyExtractor = useCallback((item, index) => {
    // Primary: Use database ID if available
    if (item._id) {
      return item._id.toString();
    }

    // Secondary: Create a consistent unique key based on message properties
    const timestamp = item.createdAt || Date.now();
    const fromUser = item.fromUser || "unknown";
    const content = item.body || item.fileUrl || "";
    const contentHash = content.substring(0, 10);

    return `${fromUser}-${timestamp}-${index}-${contentHash}`;
  }, []);

  // Memoized renderItem
  const renderMessage = useCallback(
    ({ item, index }) => {
      const mine = String(item.fromUser) === String(me?._id);
      const showTime =
        index === msgs.length - 1 ||
        (msgs[index + 1] &&
          String(msgs[index + 1].fromUser) !== String(item.fromUser));

      return (
        <MessageItem
          item={item}
          index={index}
          isMyMessage={mine}
          showTime={showTime}
          onFilePress={handleFilePress}
          getFileIcon={getFileIcon}
          getFullFileUrl={getFullFileUrl}
          isImage={isImage}
          formatTime={formatTime}
        />
      );
    },
    [
      me?._id,
      msgs.length,
      handleFilePress,
      getFileIcon,
      getFullFileUrl,
      isImage,
      formatTime,
    ]
  );

  const send = useCallback(() => {
    if (!text.trim() || !me?._id) return;

    const roomId = [me._id, peerId].sort().join("-");
    socketRef.current.emit("sendMessage", {
      fromUser: me._id,
      toUser: peerId,
      body: text,
    });
    setText("");

    // Animate input back to normal size
    Animated.timing(inputHeight, {
      toValue: 50,
      duration: 200,
      useNativeDriver: false,
    }).start();

    socketRef.current.emit("stopTyping", { userId: me._id, peerId });
  }, [text, me?._id, peerId, inputHeight]);

  const handleTextChange = useCallback(
    (value) => {
      setText(value);

      // Auto-resize input
      const lines = value.split("\n").length;
      const newHeight = Math.min(Math.max(50, lines * 20 + 30), 120);
      Animated.timing(inputHeight, {
        toValue: newHeight,
        duration: 100,
        useNativeDriver: false,
      }).start();

      if (value.trim() && socketRef.current) {
        socketRef.current.emit("userTyping", { userId: me._id, peerId });
      }
    },
    [me?._id, peerId, inputHeight]
  );

  const pickFile = useCallback(async () => {
    if (!me?._id || isUploading) return;

    try {
      setIsUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "image/*",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", {
        uri:
          Platform.OS === "android"
            ? result.assets[0].uri
            : result.assets[0].uri.replace("file://", ""),
        name: result.assets[0].name || "file",
        type: result.assets[0].mimeType || getMimeType(result.assets[0].name),
      });
      formData.append("fromUser", me._id);
      formData.append("toUser", peerId);

      const response = await axios.post(
        `${API_BACKEND}/api/messages/file`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      // Ensure the uploaded message has a unique ID
      const messageWithId = ensureUniqueMessage(response.data);

      // Check for duplicates before adding
      setMsgs((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            m._id === messageWithId._id ||
            (m.fileUrl &&
              m.fileUrl === messageWithId.fileUrl &&
              m.fromUser === messageWithId.fromUser &&
              Math.abs(
                new Date(m.createdAt).getTime() -
                  new Date(messageWithId.createdAt).getTime()
              ) < 5000)
        );
        socketRef.current.emit('newMessage', messageWithId);
        if (isDuplicate) {
          return prev;
        }

        return [...prev, messageWithId];
      });

      scrollToEnd();
    } catch (error) {
      console.error("File upload error:", error);
      Alert.alert("Upload Error", "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [
    me?._id,
    isUploading,
    getMimeType,
    peerId,
    scrollToEnd,
    ensureUniqueMessage,
  ]);

  const onContentSizeChange = useCallback(() => {
    scrollToEnd();
  }, [scrollToEnd]);

  // Memoized FlatList content style
  const flatListContentStyle = useMemo(
    () => [
      styles.messagesContainer,
      performanceStyles.flatListContent,
      keyboardVisible && styles.messagesContainerKeyboard,
      keyboardVisible && performanceStyles.flatListContentKeyboard,
    ],
    [keyboardVisible]
  );

  useEffect(() => {
    StatusBar.setBarStyle("dark-content", true);
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("transparent", true);
      StatusBar.setTranslucent(true);
    }

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        scrollToEnd();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, [scrollToEnd]);

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  useEffect(() => {
    (async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        const u = JSON.parse(userData || "{}");
        if (!u?._id) {
          Alert.alert("Error", "User data not found");
          return;
        }
        setMe(u);

        socketRef.current = io(API_BACKEND, {
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketRef.current.on("connect", () => {
          const roomId = [u._id, peerId].sort().join("-");
          socketRef.current.emit("joinRoom", { userId: u._id, peerId });
        });

        // Fixed newMessage handler with better duplicate prevention
        socketRef.current.on("newMessage", (msg) => {
          setMsgs((prev) => {
            // Ensure message has an ID
            const messageWithId = ensureUniqueMessage({ ...msg });

            // Check if message already exists (multiple checks for safety)
            const isDuplicate = prev.some((m) => {
              // Same ID check
              if (m._id === messageWithId._id) return true;

              // Same content and user within time window (for real-time duplicates)
              if (
                m.fromUser === messageWithId.fromUser &&
                m.body === messageWithId.body &&
                m.fileUrl === messageWithId.fileUrl
              ) {
                const timeDiff = Math.abs(
                  new Date(m.createdAt || 0).getTime() -
                    new Date(messageWithId.createdAt || 0).getTime()
                );
                return timeDiff < 2000; // 2 second window
              }

              return false;
            });

            if (isDuplicate) {
              return prev;
            }

            // Add to processed set
            if (processedMessageIds.current) {
              processedMessageIds.current.add(messageWithId._id);
            }

            const updatedMsgs = [...prev, messageWithId];
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
            return updatedMsgs;
          });
        });

        socketRef.current.on("userTyping", (data) => {
          if (data.userId !== u._id) {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 3000);
          }
        });

        // Load initial messages
        const { data } = await axios.get(`${API_BACKEND}/api/messages`, {
          params: { userA: u._id, userB: peerId },
        });

        // Ensure all loaded messages have unique IDs
        const messagesWithIds = data.map((msg) => ensureUniqueMessage(msg));

        // Remove any potential duplicates from server response
        const uniqueMessages = messagesWithIds.filter(
          (msg, index, arr) => arr.findIndex((m) => m._id === msg._id) === index
        );

        setMsgs(uniqueMessages);

        // Track processed message IDs
        uniqueMessages.forEach((msg) => {
          if (processedMessageIds.current) {
            processedMessageIds.current.add(msg._id);
          }
        });

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 500);
      } catch (error) {
        console.error("Error in useEffect:", error.message);
        Alert.alert("Connection Error", "Failed to connect to chat server");
      }
    })();

    return () => {
      socketRef.current?.disconnect();
      // Clear processed message IDs on cleanup
      if (processedMessageIds.current) {
        processedMessageIds.current.clear();
      }
    };
  }, [peerId, ensureUniqueMessage]);

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
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.placeholder} />
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <FlatList
          ref={flatListRef}
          contentContainerStyle={flatListContentStyle}
          data={msgs}
          keyExtractor={keyExtractor}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={onContentSizeChange}
          // Performance optimizations
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
          getItemLayout={null} // Let FlatList calculate dynamically for variable height messages
        />

        {isTyping && <TypingIndicator typingAnimation={typingAnimation} />}
        {isUploading && <UploadProgress uploadProgress={uploadProgress} />}

        <BlurView intensity={95} style={styles.inputBlur}>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={pickFile}
              style={[
                styles.attachButton,
                isUploading && styles.attachButtonDisabled,
              ]}
              disabled={isUploading}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={
                  isUploading ? ["#E5E7EB", "#F3F4F6"] : ["#667EEA", "#764BA2"]
                }
                style={styles.attachGradient}
              >
                <Ionicons
                  name="attach"
                  size={20}
                  color={isUploading ? "#9CA3AF" : "#FFFFFF"}
                />
              </LinearGradient>
            </TouchableOpacity>

            <Animated.View
              style={[styles.textInputContainer, { height: inputHeight }]}
            >
              <TextInput
                style={styles.textInput}
                value={text}
                onChangeText={handleTextChange}
                placeholder="Type your message..."
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={1000}
                textAlignVertical="center"
              />
            </Animated.View>

            <TouchableOpacity
              onPress={send}
              style={styles.sendButton}
              disabled={!text.trim()}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={
                  text.trim() ? ["#667EEA", "#764BA2"] : ["#E5E7EB", "#F3F4F6"]
                }
                style={styles.sendGradient}
              >
                <Ionicons
                  name="send"
                  size={18}
                  color={text.trim() ? "#FFFFFF" : "#9CA3AF"}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>
    </SafeAreaView>
  );
}
