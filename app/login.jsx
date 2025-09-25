import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig"; // import db
import { doc, setDoc } from "firebase/firestore"; // Firestore methods
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save or update login record in Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          lastLogin: new Date(),
        },
        { merge: true } // merge:true = update instead of overwrite
      );

      Alert.alert("Login successful!");
      router.push("/dashboard");

    } catch (err) {
      Alert.alert("Login error", err.message);
    }
  };

  return (
    <LinearGradient
      colors={["#2E0249", "#570A57", "#A91079"]}
      style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}
    >
      <Text style={{ fontSize: 28, color: "#fff", fontWeight: "bold", marginBottom: 30 }}>
        𝐋𝐨𝐠 𝐈𝐧
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        style={{
          width: "40%",
          backgroundColor: "rgba(255,255,255,0.1)",
          color: "#fff",
          padding: 12,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          width: "40%",
          backgroundColor: "rgba(255,255,255,0.1)",
          color: "#fff",
          padding: 12,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          width: "30%",
          backgroundColor: "#9333EA",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>𝐋𝐨𝐠 𝐈𝐧</Text>
      </TouchableOpacity>

      {/* Sign up Link */}
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={{ color: "#fff" }}>𝒟𝑜𝓃'𝓉 𝒽𝒶𝓋𝑒 𝒶𝓃 𝒶𝒸𝒸𝑜𝓊𝓃𝓉? 𝒮𝒾𝑔𝓃 𝒰𝓅</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}