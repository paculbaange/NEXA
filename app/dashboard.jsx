import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth"; // signOut removed
import { FlashcardsContext } from "./FlashcardsContext";

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [definition, setDefinition] = useState(null);
  const [synonyms, setSynonyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Definitions");
  const router = useRouter();

  const { flashcards, addFlashcard } = useContext(FlashcardsContext) || {};

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || user.email);
    }
  }, []);

  const fetchMeaning = async () => {
    if (!searchWord.trim()) {
      Alert.alert("Please enter a word to search.");
      return;
    }
    setLoading(true);
    setDefinition(null);
    setSynonyms([]);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord.toLowerCase()}`
      );
      if (!response.ok) throw new Error("Word not found");
      const data = await response.json();

      const firstMeaning = data[0]?.meanings[0];
      const definitionText = firstMeaning?.definitions[0]?.definition;
      const partOfSpeech = firstMeaning?.partOfSpeech;

      if (definitionText && partOfSpeech) {
        setDefinition({
          word: data[0].word,
          partOfSpeech,
          definition: definitionText,
          phonetic: data[0]?.phonetics?.find((p) => p.text)?.text || "",
        });

        // ✅ Collect synonyms from ALL meanings & definitions
        const allSynonyms = [];
        (data[0].meanings || []).forEach((meaning) => {
          (meaning.definitions || []).forEach((def) => {
            if (def.synonyms && def.synonyms.length > 0) {
              def.synonyms.forEach((syn) => {
                if (!allSynonyms.includes(syn)) {
                  allSynonyms.push(syn);
                }
              });
            }
          });
          if (meaning.synonyms && meaning.synonyms.length > 0) {
            meaning.synonyms.forEach((syn) => {
              if (!allSynonyms.includes(syn)) {
                allSynonyms.push(syn);
              }
            });
          }
        });

        setSynonyms(allSynonyms);
      } else {
        setDefinition(null);
        setSynonyms([]);
        Alert.alert("Meaning not found");
      }
    } catch (error) {
      console.log("fetchMeaning error:", error);
      setDefinition(null);
      setSynonyms([]);
      Alert.alert("Error fetching word meaning.");
    } finally {
      setLoading(false);
    }
  };

  const saveToLibrary = () => {
    if (!definition) {
      Alert.alert("No word to save");
      return;
    }

    if (!addFlashcard || typeof addFlashcard !== "function") {
      Alert.alert(
        "Library not available",
        "Flashcards provider not detected. Make sure your app is wrapped with <FlashcardsProvider>."
      );
      return;
    }

    const exists = (flashcards || []).some(
      (card) => card.word.toLowerCase() === definition.word.toLowerCase()
    );
    if (exists) {
      Alert.alert("Already saved", "This word is already in your library.");
      return;
    }

    const newFlashcard = {
      id: Date.now().toString(),
      word: definition.word,
      partOfSpeech: definition.partOfSpeech,
      definition: definition.definition,
      question: definition.word,
      answer: `${definition.partOfSpeech}\nDefinition: ${definition.definition}`,
      flipped: false,
    };

    addFlashcard(newFlashcard);

    Alert.alert(
      "Saved",
      `${definition.word} saved to your library.`,
      [
        { text: "Go to Library", onPress: () => router.push("/library") },
        { text: "OK", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Dictionary Header */}
      <Text style={styles.dictionaryHeader}>Dictionary</Text>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a word..."
          placeholderTextColor="#888"
          value={searchWord}
          onChangeText={setSearchWord}
          onSubmitEditing={fetchMeaning}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={fetchMeaning}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <ScrollView style={styles.results} contentContainerStyle={{ paddingBottom: 24 }}>
        {loading && <ActivityIndicator size="large" color="#000" />}

        {definition && !loading && (
          <>
            <Text style={styles.word}>{definition.word}</Text>
            {definition.phonetic ? (
              <Text style={styles.phonetic}>{definition.phonetic}</Text>
            ) : null}

            <View style={styles.tabs}>
              {["Definitions", "Thesaurus"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.card}>
              {activeTab === "Definitions" ? (
                <>
                  <Text style={styles.partOfSpeech}>{definition.partOfSpeech}</Text>
                  <Text style={styles.definition}>{definition.definition}</Text>
                </>
              ) : (
                <View style={styles.synonymContainer}>
                  {synonyms.length > 0 ? (
                    synonyms.map((syn, i) => (
                      <View key={i} style={styles.synonymChip}>
                        <Text style={styles.synonymText}>{syn}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noSynonyms}>No synonyms available.</Text>
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={saveToLibrary}>
              <Text style={styles.saveBtnText}>➕ Save to Library</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0ff",
    paddingHorizontal: 24, // 📘 wider side margins like a book
    paddingTop: 20,
  },
  dictionaryHeader: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#7f3dff",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 1,
  },
  searchBar: {
    flexDirection: "row",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#b088f9",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 17,
    color: "#000",
  },
  searchBtn: {
    backgroundColor: "#7f3dff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  searchBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  results: {
    flex: 1,
  },
  word: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#4a148c",
    textAlign: "left",
  },
  phonetic: {
    fontSize: 18,
    color: "#6a1b9a",
    marginBottom: 16,
    fontStyle: "italic",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#d1c4e9",
  },
  activeTab: {
    backgroundColor: "#7f3dff",
  },
  tabText: {
    fontSize: 15,
    color: "#4a148c",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 5,
    borderLeftColor: "#7f3dff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  partOfSpeech: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#6a1b9a",
    marginBottom: 8,
  },
  definition: {
    fontSize: 18,
    lineHeight: 28, // 📘 more spacing like in books
    color: "#212121",
  },
  saveBtn: {
    backgroundColor: "#9c27b0",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  saveBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  synonymContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  synonymChip: {
    backgroundColor: "#ba68c8",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  synonymText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  noSynonyms: {
    fontSize: 15,
    color: "#666",
    fontStyle: "italic",
  },
});
