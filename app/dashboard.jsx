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
  );
}

const styles = StyleSheet.create({
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
});
