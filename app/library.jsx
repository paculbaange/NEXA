import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // ✅ Import gradient
import { FlashcardsContext } from "./FlashcardsContext";

export default function Library() {
  const { flashcards, deleteFlashcard, clearFlashcards } = useContext(FlashcardsContext);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.word}>{item.question}</Text>
        <Text style={styles.definition}>{item.answer}</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteFlashcard(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={["#2a003f", "#aa007a"]}
      style={styles.container}
    >
      <Text style={styles.title}>Your Library</Text>

      {flashcards.length === 0 ? (
        <Text style={styles.emptyText}>No flashcards saved yet.</Text>
      ) : (
        <>
          <FlatList
            data={flashcards}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <TouchableOpacity style={styles.clearButton} onPress={clearFlashcards}>
            <Text style={styles.clearButtonText}>Clear Library</Text>
          </TouchableOpacity>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  emptyText: {
    color: "#f0d9ff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  word: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  definition: {
    color: "#eee",
    marginTop: 6,
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 15,
    backgroundColor: "#d44fd9ff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#d44fd9ff",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
