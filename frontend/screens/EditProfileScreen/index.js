import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import styles from "./style";
import { API_BACKEND } from "../../api";

const { width } = Dimensions.get("window");

const defaultSkills = [
  // Programming Languages
  "C",
  "C++",
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "Swift",

  // Web & App Development
  "React",
  "React Native",
  "Node.js",
  "Express",
  "HTML",
  "CSS",
  "Redux",
  "Flutter",

  // Databases
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "SQL",

  // Tools & Platforms
  "Docker",
  "Kubernetes",
  "AWS",
  "Firebase",
  "Tailwind CSS",
  "GraphQL",
  "Excel",
  "Power BI",
  "Figma",
  "Canva",

  // CS Fundamentals
  "Data Structures & Algorithms",
  "Cybersecurity Basics",
  "Blockchain Basics",

  // Communication & Soft Skills
  "English Grammar",
  "Blogging",
  "Podcast Creation",
  "Social Media Content Creation",
  "Sign Language Basics",
  "Entrepreneurship Basics",
  "Interview Preparation Techniques",
  "Resume Building",
  "Public Speaking",
  "Networking Skills",

  // Creative Skills
  "Drawing & Sketching",
  "Video Editing",
];

export default function EditProfileScreen({ navigation, route }) {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [age, setAge] = useState("");
  const [qualification, setQualification] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [learnSkillInput, setLearnSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [filteredLearnSkills, setFilteredLearnSkills] = useState([]);
  const [isSkillsFocused, setIsSkillsFocused] = useState(false);
  const [isLearnFocused, setIsLearnFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [validationModalVisible, setValidationModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const userData = await AsyncStorage.getItem("user");
      const parsedUser = JSON.parse(userData);
      setName(parsedUser.name || "");

      if (route.params?.profile) {
        const p = route.params.profile;
        setDesignation(p.designation || "");
        setProfilePic(
          p.profilePic
            ? p.profilePic.startsWith("http")
              ? p.profilePic
              : `${API_BACKEND}${p.profilePic}`
            : ""
        );
        setAge(p.age?.toString() || "");
        setQualification(p.qualification || "");
        setSkills(p.skills || []);
        setSkillsToLearn(p.skillsToLearn || []);
      }
    };
    loadData();
  }, [route.params]);

  let pickImage = async () => {
    try {
      let permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        alert("Permission is required!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setProfilePic(result.assets[0].uri);
        // Clear validation error for profile pic
        if (validationErrors.profilePic) {
          setValidationErrors((prev) => ({ ...prev, profilePic: null }));
        }
      }
    } catch (err) {
      console.error("Image Picker error:", err);
    }
  };

  useEffect(() => {
    if (skillInput.trim().length > 0) {
      const list = defaultSkills
        .filter(
          (s) =>
            s.toLowerCase().includes(skillInput.toLowerCase()) &&
            !skills.includes(s) &&
            !skillsToLearn.includes(s)
        )
        .slice(0, 2);
      setFilteredSkills(list);
    } else {
      // input is empty → no recommendations
      setFilteredSkills([]);
    }
  }, [skillInput, skills, skillsToLearn]);

  useEffect(() => {
    if (learnSkillInput.trim().length > 0) {
      const list = defaultSkills
        .filter(
          (s) =>
            s.toLowerCase().includes(learnSkillInput.toLowerCase()) &&
            !skillsToLearn.includes(s) &&
            !skills.includes(s)
        )
        .slice(0, 2);
      setFilteredLearnSkills(list);
    } else {
      // input is empty → no recommendations
      setFilteredLearnSkills([]);
    }
  }, [learnSkillInput, skillsToLearn, skills]);

  const handleAddSkill = (type, value) => {
    if (type === "skills" && value && !skills.includes(value)) {
      setSkills([...skills, value]);
      setSkillInput("");
      // Clear validation error for skills
      if (validationErrors.skills) {
        setValidationErrors((prev) => ({ ...prev, skills: null }));
      }
    }
    if (type === "learn" && value && !skillsToLearn.includes(value)) {
      setSkillsToLearn([...skillsToLearn, value]);
      setLearnSkillInput("");
      // Clear validation error for skills to learn
      if (validationErrors.skillsToLearn) {
        setValidationErrors((prev) => ({ ...prev, skillsToLearn: null }));
      }
    }
  };

  // Clear validation errors when user starts typing
  const handleInputChange = (field, value, setter) => {
    setter(value);
    if (validationErrors[field] && value.trim()) {
      setValidationErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!designation || !designation.trim()) {
      errors.designation = "Designation is required";
    }

    if (!profilePic || profilePic === "") {
      errors.profilePic = "Profile picture is required";
    }

    if (!age || !age.trim()) {
      errors.age = "Age is required";
    } else if (isNaN(age) || parseInt(age) < 1 || parseInt(age) > 150) {
      errors.age = "Please enter a valid age (1-150)";
    }

    if (!qualification || !qualification.trim()) {
      errors.qualification = "Qualification is required";
    }

    if (!skills || skills.length === 0) {
      errors.skills = "At least one skill is required";
    }

    if (!skillsToLearn || skillsToLearn.length === 0) {
      errors.skillsToLearn = "At least one skill to learn is required";
    }
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();

    console.log("Validation errors:", errors); // Debug log
    console.log("Error count:", Object.keys(errors).length); // Debug log

    if (Object.keys(errors).length > 0) {
      console.log("Setting validation errors and showing modal"); // Debug log
      setValidationErrors(errors);
      setTimeout(() => {
        setValidationModalVisible(true);
      }, 100); // Small delay to ensure state is set
      return;
    }

    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(userData);

      const formData = new FormData();
      formData.append("userId", parsed._id);
      formData.append("designation", designation);
      formData.append("age", age);
      formData.append("qualification", qualification);
      formData.append("skills", JSON.stringify(skills));
      formData.append("skillsToLearn", JSON.stringify(skillsToLearn));

      if (profilePic && profilePic.startsWith("file://")) {
        formData.append("profilePic", {
          uri:
            Platform.OS === "android"
              ? profilePic
              : profilePic.replace("file://", ""),
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }

      const response = await axios.post(
        `${API_BACKEND}/api/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.profilePic) {
        setProfilePic(
          response.data.profilePic.startsWith("http")
            ? response.data.profilePic
            : `${API_BACKEND}${response.data.profilePic}`
        );
      }

      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        setLoading(false);
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error("Error updating profile:", error);
      // You could also show an error modal here instead of alert
      setValidationErrors({
        general: "Failed to update profile. Please try again.",
      });
      setValidationModalVisible(true);
    }
  };

  // Success Modal Component
  const SuccessModal = () => (
    <Modal visible={modalVisible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.modalTitle}>Success!</Text>
          <Text style={styles.modalMessage}>
            Your profile has been updated successfully
          </Text>
        </View>
      </View>
    </Modal>
  );

  // Validation Error Modal Component - Using Working Inline Styles
  const ValidationErrorModal = () => {
    console.log("Modal render - validationErrors:", validationErrors); // Debug
    console.log("Modal visible:", validationModalVisible); // Debug

    // Get error messages as array
    const errorMessages = Object.values(validationErrors).filter(
      (error) => error && error.trim()
    );

    return (
      <Modal
        visible={validationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setValidationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, styles.errorModalContainer]}>
            <View style={[styles.successIcon, styles.errorIcon]}>
              <Text style={[styles.successIconText, styles.errorIconText]}>
                !
              </Text>
            </View>
            <Text style={[styles.modalTitle, styles.errorModalTitle]}>
              Required Fields Missing
            </Text>

            {errorMessages.length > 0 && (
              <View
                style={[
                  styles.errorListContainer,
                  { maxHeight: 250, width: "100%" },
                ]}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                >
                  {errorMessages.map((error, index) => (
                    <View
                      key={`error-${index}`}
                      style={{
                        flexDirection: "row",
                        marginBottom: 6,
                        marginLeft: 35,
                      }}
                    >
                      <Text
                        style={{ color: "red", fontSize: 16, marginRight: 6 }}
                      >
                        •
                      </Text>
                      <Text style={{ color: "black", fontSize: 16 }}>
                        {error}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                setValidationModalVisible(false);
                // Clear general error if it exists
                if (validationErrors.general) {
                  setValidationErrors((prev) => {
                    const { general, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              style={styles.errorModalButton}
            >
              <Text style={styles.errorModalButtonText}>OK, Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileSection}>
            <TouchableOpacity
              onPress={() => pickImage()}
              style={[
                styles.profilePicContainer,
                validationErrors.profilePic && styles.errorBorder,
              ]}
            >
              <Image
                source={
                  profilePic
                    ? { uri: profilePic }
                    : require("../../assets/front.jpg")
                }
                style={styles.profilePic}
                resizeMode="cover"
              />
              <View style={styles.cameraOverlay}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.profileHint}>
              Tap to change photo <Text style={styles.required}>*</Text>
            </Text>
            {validationErrors.profilePic && (
              <Text style={styles.errorText}>
                {validationErrors.profilePic}
              </Text>
            )}
          </View>

          <View style={styles.formContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={name}
                editable={false}
                style={[styles.input, styles.disabledInput]}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Designation <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={designation}
                onChangeText={(value) =>
                  handleInputChange("designation", value, setDesignation)
                }
                style={[
                  styles.input,
                  validationErrors.designation && styles.inputError,
                ]}
                placeholder="e.g., Software Developer"
                placeholderTextColor="#999"
              />
              {validationErrors.designation && (
                <Text style={styles.errorText}>
                  {validationErrors.designation}
                </Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Age <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={age}
                onChangeText={(value) =>
                  handleInputChange("age", value, setAge)
                }
                keyboardType="numeric"
                style={[
                  styles.input,
                  validationErrors.age && styles.inputError,
                ]}
                placeholder="Enter your age"
                placeholderTextColor="#999"
                maxLength={2}
              />
              {validationErrors.age && (
                <Text style={styles.errorText}>{validationErrors.age}</Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Qualification <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={qualification}
                onChangeText={(value) =>
                  handleInputChange("qualification", value, setQualification)
                }
                style={[
                  styles.input,
                  validationErrors.qualification && styles.inputError,
                ]}
                placeholder="e.g., B.Tech Computer Science"
                placeholderTextColor="#999"
              />
              {validationErrors.qualification && (
                <Text style={styles.errorText}>
                  {validationErrors.qualification}
                </Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Skills <Text style={styles.labelCount}>({skills.length})</Text>
                <Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={skillInput}
                  onChangeText={setSkillInput}
                  style={[
                    styles.input,
                    validationErrors.skills && styles.inputError,
                  ]}
                  placeholder="Add your skills..."
                  placeholderTextColor="#999"
                  onFocus={() => setIsSkillsFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSkillsFocused(false), 150)
                  }
                />
                {isSkillsFocused && filteredSkills.length > 0 && (
                  <View style={styles.dropdown}>
                    {filteredSkills.map((skill, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleAddSkill("skills", skill)}
                        style={[
                          styles.dropdownItem,
                          index === filteredSkills.length - 1 &&
                            styles.lastDropdownItem,
                        ]}
                      >
                        <Text style={styles.dropdownText}>{skill}</Text>
                        <Text style={styles.addIcon}>+</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {skills.length > 0 && (
                <View style={styles.skillsContainer}>
                  {skills.map((skill, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        setSkills(skills.filter((s) => s !== skill))
                      }
                      style={styles.skillTag}
                    >
                      <Text style={styles.skillTagText}>{skill}</Text>
                      <Text style={styles.removeIcon}>×</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {validationErrors.skills && (
                <Text style={styles.errorText}>{validationErrors.skills}</Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Skills to Learn{" "}
                <Text style={styles.labelCount}>({skillsToLearn.length})</Text>
                <Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={learnSkillInput}
                  onChangeText={setLearnSkillInput}
                  style={[
                    styles.input,
                    validationErrors.skillsToLearn && styles.inputError,
                  ]}
                  placeholder="What do you want to learn?"
                  placeholderTextColor="#999"
                  onFocus={() => setIsLearnFocused(true)}
                  onBlur={() => setTimeout(() => setIsLearnFocused(false), 150)}
                />
                {isLearnFocused && filteredLearnSkills.length > 0 && (
                  <View style={styles.dropdown}>
                    {filteredLearnSkills.map((skill, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleAddSkill("learn", skill)}
                        style={[
                          styles.dropdownItem,
                          index === filteredLearnSkills.length - 1 &&
                            styles.lastDropdownItem,
                        ]}
                      >
                        <Text style={styles.dropdownText}>{skill}</Text>
                        <Text style={styles.addIcon}>+</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {skillsToLearn.length > 0 && (
                <View style={styles.skillsContainer}>
                  {skillsToLearn.map((skill, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        setSkillsToLearn(
                          skillsToLearn.filter((s) => s !== skill)
                        )
                      }
                      style={[styles.skillTag, styles.learnSkillTag]}
                    >
                      <Text style={styles.learnSkillTagText}>{skill}</Text>
                      <Text style={styles.removeIcon}>×</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {validationErrors.skillsToLearn && (
                <Text style={styles.errorText}>
                  {validationErrors.skillsToLearn}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Saving..." : "Save Profile"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Render Modals */}
      <SuccessModal />
      <ValidationErrorModal />
    </SafeAreaView>
  );
}
