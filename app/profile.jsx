import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const [profileImage, setProfileImage] = useState(null);
  const [bio, setBio] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        setEmail(user.email || "");

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.fullName || "");
          setUsername(data.username || "");
          setGender(data.gender?.toLowerCase() || "not specified");
          setBio(data.bio || "");
          setLocation(data.location || "");
          setEducation(data.education || "");
          setOccupation(data.occupation || "");
          setInterests(data.interests || "");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        bio,
        location,
        education,
        occupation,
        interests,
      });

      Alert.alert("Success", "Your profile has been updated.");
    } catch (error) {
      console.log("Error saving profile:", error);
      Alert.alert("Error", "Failed to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const renderGender = () => {
    if (gender === "female") return "👩 Female";
    if (gender === "male") return "👨 Male";
    return "⚧ Not specified";
  };

  if (loading) {
    return (
      <LinearGradient colors={["#7209b7", "#b5179e"]} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#7209b7", "#b5179e"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("../assets/images/waguri.png")
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>

          <Text style={styles.fullName}>{fullName}</Text>
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.genderBox}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.genderText}>{renderGender()}</Text>
          </View>

          {/* Display bio and other details below profile image */}
          <View style={styles.displayedDetailsContainer}>
            {bio ? <Text style={styles.detailText}>{bio}</Text> : null}
            {location ? <Text style={styles.detailText}>📍 {location}</Text> : null}
            {education ? <Text style={styles.detailText}>🎓 {education}</Text> : null}
            {occupation ? <Text style={styles.detailText}>💼 {occupation}</Text> : null}
            {interests ? <Text style={styles.detailText}>🧠 {interests}</Text> : null}
          </View>

          {/* Editable Bio & Other Details Form */}
          <View style={styles.detailSection}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.input}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#aaa"
              value={bio}
              onChangeText={setBio}
              multiline
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Where are you from?"
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.label}>Education</Text>
            <TextInput
              style={styles.input}
              placeholder="Your school or degree"
              value={education}
              onChangeText={setEducation}
            />

            <Text style={styles.label}>Occupation</Text>
            <TextInput
              style={styles.input}
              placeholder="Your job or title"
              value={occupation}
              onChangeText={setOccupation}
            />

            <Text style={styles.label}>Interests</Text>
            <TextInput
              style={styles.input}
              placeholder="What do you love to do?"
              value={interests}
              onChangeText={setInterests}
            />

            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.6 }]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save Profile"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: "#fff",
    width: "60%",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 24,
    marginBottom: 30,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#b5179e",
    marginBottom: 20,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  username: {
    fontSize: 16,
    color: "#777",
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    color: "#999",
    marginTop: 2,
  },
  genderBox: {
    marginTop: 18,
    alignItems: "center",
  },
  genderText: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: "#b5179e",
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  displayedDetailsContainer: {
    marginTop: 20,
    width: "30%",
    alignItems: "center",
  },
  detailText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 4,
    textAlign: "center",
  },
  detailSection: {
    marginTop: 24,
    width: "50%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    color: "#333",
    minHeight: 40,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#b5179e",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#f72585",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
