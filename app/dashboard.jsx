<<<<<<< HEAD
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth"; // Firebase
import { useRouter } from "expo-router"; // Navigation after logout

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Prefer displayName, fallback to email
      setUserName(user.displayName || user.email);
    }
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.replace("/login"); // Navigate to login screen
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hello, {userName ? userName : "Guest"}
      </Text>
      <Text style={styles.subtitle}>Create new task here</Text>

      <View style={styles.cardRow}>
        <View style={styles.card}><Text>📂 Project 150</Text></View>
        <View style={styles.card}><Text>👤 Meetings</Text></View>
      </View>
      <View style={styles.cardRow}>
        <View style={styles.card}><Text>🔄 Ongoing 50</Text></View>
        <View style={styles.card}><Text>✅ Done 100</Text></View>
      </View>

      <View style={styles.activityCard}>
        <Text style={styles.activityText}>📊 Activity</Text>
        <Text>30 hours, 50 min this week</Text>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutWrapper}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
=======
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState({});
  const router = useRouter();

  const auth = getAuth();
  const db = getFirestore();

  // Load tasks from Firestore
  useEffect(() => {
    if (auth.currentUser) {
      loadTasks();
      setUserName(auth.currentUser.displayName || auth.currentUser.email);
    }
  }, []);

  const loadTasks = async () => {
    try {
      const q = query(
        collection(db, "dashboardTasks"),
        where("uid", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const loaded = {};
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!loaded[data.category]) loaded[data.category] = [];
        loaded[data.category].push({
          id: docSnap.id,
          text: data.text,
          image: data.image || null,
        });
      });
      setTasks(loaded);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  // Save tasks to Firestore
  const saveTasks = async () => {
    try {
      for (const category in tasks) {
        for (const task of tasks[category]) {
          // Skip if already has an ID (already saved in Firestore)
          if (task.id) continue;

          await addDoc(collection(db, "dashboardTasks"), {
            uid: auth.currentUser.uid,
            category,
            text: task.text,
            image: task.image || null,
            createdAt: new Date(),
          });
        }
      }
      alert("✅ Saved to Firestore!");
      loadTasks(); // Refresh after saving
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const openCard = (cardTitle) => {
    setSelectedCard(cardTitle);
    setModalVisible(true);
  };

  const handleAddTask = (imageUri = null) => {
    if (!newTask.trim() && !imageUri) return;
    setTasks((prev) => ({
      ...prev,
      [selectedCard]: [
        ...(prev[selectedCard] || []),
        { text: newTask.trim(), image: imageUri },
      ],
    }));
    setNewTask("");
  };

  const handleDeleteTask = async (index) => {
    const target = tasks[selectedCard][index];
    if (target.id) {
      await deleteDoc(doc(db, "dashboardTasks", target.id));
    }
    setTasks((prev) => {
      const updated = { ...prev };
      updated[selectedCard] = updated[selectedCard].filter((_, i) => i !== index);
      return updated;
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) handleAddTask(result.assets[0].uri);
  };

 return (
  <ImageBackground
    source={require("../assets/images/lavender.png")}
    style={styles.background}
    resizeMode="cover"
  >
    <View style={styles.container}>
      <Text style={styles.title}>🌸 Hello, {userName || "Guest"}</Text>
      <Text style={styles.subtitle}>Your lavender tasks 💜</Text>


        {/* Card Rows */}
        <View style={styles.cardRow}>
          <TouchableOpacity style={styles.card} onPress={() => openCard("Projects")}>
            <Text style={styles.cardText}>📂 Projects</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => openCard("Research")}>
            <Text style={styles.cardText}>👤 Research</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardRow}>
          <TouchableOpacity style={styles.card} onPress={() => openCard("Screenshots")}>
            <Text style={styles.cardText}>🔄 Screenshots</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => openCard("Activities")}>
            <Text style={styles.cardText}>🌼 Activities</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🌺 {selectedCard}</Text>

              <TextInput
                style={styles.input}
                placeholder="Write something..."
                value={newTask}
                onChangeText={setNewTask}
              />

              {/* Add & Attach */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#a78bfa" }]}
                  onPress={() => handleAddTask()}
                >
                  <Text style={styles.buttonText}>➕ Add Task</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#7c3aed" }]}
                  onPress={pickImage}
                >
                  <Text style={styles.buttonText}>📷 Attach</Text>
                </TouchableOpacity>
              </View>

              {/* 💾 Save Button */}
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#22c55e", marginTop: 8 }]}
                onPress={saveTasks}
              >
                <Text style={styles.buttonText}>💾 Save</Text>
              </TouchableOpacity>

              {/* Task List */}
              <FlatList
                data={tasks[selectedCard] || []}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.taskItem}>
                    {item.text ? <Text style={styles.taskText}>🌸 {item.text}</Text> : null}
                    {item.image ? (
                      <Image source={{ uri: item.image }} style={styles.taskImage} />
                    ) : null}

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteTask(index)}
                    >
                      <Text style={styles.deleteText}>🗑 Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#d946ef", marginTop: 12 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>❌ Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
>>>>>>> 68b0d88 (FINAL COMMIT)
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { 
    flex: 1, 
    backgroundColor: "#8e2de2", 
    padding: 20, 
    justifyContent: "flex-start", // Keep the content at the top
    alignItems: "stretch", // Stretch horizontally but not vertically
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 20 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  card: {
    flex: 1,
    margin: 3,
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    alignItems: "center",
    width: '30%',
  },
  activityCard: {
    marginTop: 10,
    padding: 20,
    backgroundColor: "#eee",
    borderRadius: 5,
    alignItems: "center",
    width: '30%',  
  },
  activityText: { fontWeight: "bold", marginBottom: 5 },

  // Wrapper to center the logout button
  logoutWrapper: {
    flex: 1, // Take remaining space
    justifyContent: "flex-end", // Align button at the bottom
    alignItems: "center", // Center it horizontally
    marginTop: 20, // Give it a little space from other elements
  },

  // Logout button styles
  logoutButton: {
    backgroundColor: "#8e2de2",
    borderRadius: 30,
    padding: 10,
    height: 20, // Keep the original height
    justifyContent: "center",
    alignItems: "center",
    width: '40%',
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 20 },
=======
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#edebf1ff", marginBottom: 5 },
  subtitle: { fontSize: 16, marginBottom: 20, color: "#29282bff" },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  card: {
    flex: 1,
    marginHorizontal: 5,
    padding: 18,
    backgroundColor: "rgba(237, 233, 254, 0.9)",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#c4b5fd",
  },
  cardText: { fontSize: 15, fontWeight: "bold", color: "#5b21b6" },
  logoutWrapper: { marginTop: "auto", alignItems: "center" },
  logoutButton: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 10,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "50%",
    backgroundColor: "#faf5ff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: "#c084fc",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#dcd6e6ff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 6,
    marginBottom: 10,
    backgroundColor: "#f5f3ff",
    fontSize: 14,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: {
    flex: 1,
    padding: 7,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  taskItem: {
    marginVertical: 6,
    backgroundColor: "#ede9fe",
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: "#c4b5fd",
  },
  taskText: { fontSize: 14, color: "#4c1d95" },
  taskImage: { width: "100%", height: 100, marginTop: 6, borderRadius: 6 },
  deleteButton: {
    marginTop: 8,
    padding: 6,
    backgroundColor: "#a855f7",
    borderRadius: 6,
    alignItems: "center",
  },
  deleteText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
>>>>>>> 68b0d88 (FINAL COMMIT)
});
