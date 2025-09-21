import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

 const handleSignup = async () => {
  try {
   await createUserWithEmailAndPassword(auth, email, password);
alert("Signup Success", "Your account has been created!");
router.replace("/home");  
  } catch (err) {
    alert("Signup error: " + err.message);
  }
};



  return (
    <LinearGradient
      colors={["#2E0249", "#570A57", "#A91079"]}
      style={styles.container}
    >
      <Text style={styles.title}>𝐂𝐫𝐞𝐚𝐭𝐞 𝐀𝐜𝐜𝐨𝐮𝐧𝐭</Text>
      <Text style={styles.subtitle}>𝑱𝒐𝒊𝒏 𝑵𝑬𝑿𝑨𝑨 𝒕𝒐𝒅𝒂𝒚 🔗</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#ddd"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#ddd"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>𝐒𝐢𝐠𝐧 𝐔𝐩</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.linkText}>𝓐𝓵𝓻𝓮𝓪𝓭𝔂 𝓱𝓪𝓿𝓮 𝓪𝓷 𝓪𝓬𝓬𝓸𝓾𝓷𝓽? 𝓛𝓸𝓰 𝓘𝓷</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    color: "#ddd",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    width: "40%",
    color: "#fff",
  },
  button: {
    backgroundColor: "#9333EA",
    padding: 14,
    borderRadius: 10,
    width: "40%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: "#fff",
    textDecorationLine: "underline",
  },
});