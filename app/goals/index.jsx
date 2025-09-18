import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";

export default function Onboarding() {
  return (
    <LinearGradient colors={["#8e2de2", "#4a00e0"]} style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.title}>𝒫𝓁𝒶𝓃𝓃𝑒𝓇, 𝑅𝑒𝓂𝒾𝓃𝒹𝑒𝓇, 𝒞𝒶𝓁𝑒𝓃𝒹𝒶𝓇</Text>
        <Text style={styles.subtitle}>
          You can check and handle your project schedules in a more convenient way.
        </Text>

        <Link href="/calendar" asChild>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Let's Go</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#eee",
    textAlign: "center",
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  btnText: { color: "#8e2de2", fontWeight: "bold", fontSize: 16 },
});