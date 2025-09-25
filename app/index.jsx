import { useEffect } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === "web") {
      document.title = "NEXA Dictionary";  
    }
  }, []);

  return (
    <LinearGradient
      colors={["#2E0249", "#570A57", "#A91079"]}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {/* App Name */}
      <Text
        style={{
          fontSize: 60,
          fontWeight: "bold",
          color: "#fff",
          marginBottom: 20,
          letterSpacing: 2,
          fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", // elegant serif font for dictionary feel
        }}
      >
        𝗡𝗘𝗫𝗔
      </Text>

      {/* Tagline */}
      <Text
        style={{
          color: "#ddd",
          textAlign: "center",
          marginBottom: 50,
          fontSize: 22,
          fontStyle: "italic",
          lineHeight: 28,
          paddingHorizontal: 10,
          fontFamily: Platform.OS === "ios" ? "Palatino" : "serif",
        }}
      >
        Your trusted digital dictionary — {"\n"}
        Explore definitions, synonyms, and enrich your vocabulary every day.
      </Text>

      {/* Login Button */}
      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={{
          backgroundColor: "#9333EA",
          paddingVertical: 12,
          borderRadius: 8,
          width: "45%",
          alignItems: "center",
          marginBottom: 15,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 5,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>
          Log In
        </Text>
      </TouchableOpacity>

      {/* Sign Up Button */}
      <TouchableOpacity
        onPress={() => router.push("/signup")}
        style={{
          borderColor: "#fff",
          borderWidth: 2,
          paddingVertical: 12,
          borderRadius: 8,
          width: "45%",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>
          Sign Up
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

// Hide the header and title
export const options = {
  headerShown: false,
  title: "",
};
