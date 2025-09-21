<<<<<<< HEAD
import { useState } from "react";
=======
import { useState, useEffect } from "react"; 
>>>>>>> 68b0d88 (FINAL COMMIT)
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
<<<<<<< HEAD
  ImageBackground
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Link } from "expo-router";
=======
  ImageBackground,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Link } from "expo-router";
import { db, auth } from "../firebaseConfig"; // 👈 adjust path
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
>>>>>>> 68b0d88 (FINAL COMMIT)

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [task, setTask] = useState("");
<<<<<<< HEAD
  const [tasks, setTasks] = useState({});

  const addTask = () => {
    if (task && selectedDate) {
      const updatedTasks = { ...tasks };
      if (!updatedTasks[selectedDate]) updatedTasks[selectedDate] = [];
      updatedTasks[selectedDate].push(task);
      setTasks(updatedTasks);
=======
  const [tasks, setTasks] = useState([]);
  const user = auth.currentUser;

  // 🔹 Fetch tasks from Firestore when date changes
  const fetchTasks = async (date) => {
    if (!date || !user) return;

    const q = query(
      collection(db, "tasks"),
      where("date", "==", date),
      where("uid", "==", user.uid) // each user only sees their tasks
    );

    const querySnapshot = await getDocs(q);
    const loadedTasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(loadedTasks);
  };

  useEffect(() => {
    fetchTasks(selectedDate);
  }, [selectedDate]);

  // 🔹 Add task to Firestore
  const addTask = async () => {
    if (task && selectedDate && user) {
      const docRef = await addDoc(collection(db, "tasks"), {
        text: task,
        date: selectedDate,
        uid: user.uid,
      });

      setTasks([...tasks, { id: docRef.id, text: task, date: selectedDate, uid: user.uid }]);
>>>>>>> 68b0d88 (FINAL COMMIT)
      setTask("");
    }
  };

<<<<<<< HEAD
  const deleteTask = (date, index) => {
    const updatedTasks = { ...tasks };
    updatedTasks[date].splice(index, 1);
    setTasks(updatedTasks);
  };

  return (
    <ImageBackground
      source={{ uri: 'cat.png' }} 
      style={styles.container} // Apply background image style
    >
      <View style={styles.overlay}>
        {/* Calendar Section */}
=======
  // 🔹 Delete task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <ImageBackground source={{ uri: "cat.png" }} style={styles.container}>
      <View style={styles.overlay}>
        {/* Calendar */}
>>>>>>> 68b0d88 (FINAL COMMIT)
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#8e2de2" },
            }}
            theme={{
              todayTextColor: "#8e2de2",
              arrowColor: "#8e2de2",
              monthTextColor: "black",
            }}
<<<<<<< HEAD
            style={{ height: 300, width: '100%' }} // Resizing the calendar
          />
        </View>

        {/* Task Input Section */}
=======
            style={{ height: 300, width: "100%" }}
          />
        </View>

        {/* Input */}
>>>>>>> 68b0d88 (FINAL COMMIT)
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a task..."
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTask}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.taskHeader}>
          {selectedDate ? `To do on ${selectedDate}` : "Select a date"}
        </Text>

        {/* Task List */}
        <FlatList
<<<<<<< HEAD
          data={tasks[selectedDate] || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>📝 {item}</Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteTask(selectedDate, index)}
=======
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>📝 {item.text}</Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteTask(item.id)}
>>>>>>> 68b0d88 (FINAL COMMIT)
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            selectedDate && (
              <Text style={styles.noTask}>No Task for this date</Text>
            )
          }
        />

<<<<<<< HEAD
        {/* Navigation Button */}
=======
        {/* Navigation */}
>>>>>>> 68b0d88 (FINAL COMMIT)
        <Link href="/dashboard" asChild>
          <TouchableOpacity style={styles.navBtn}>
            <Text style={styles.navBtnText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { 
    flex: 1,
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Center content horizontally
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay for better readability
    width: '100%',
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  calendarContainer: {
    marginBottom: 20, // Space for other elements
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: 300, // Adjust height for the calendar
  },
  inputContainer: { 
    flexDirection: "row", 
    marginVertical: 15, 
    justifyContent: "center", // Center the input and button horizontally
    alignItems: "center", // Align vertically
    width: '40%', // Widen input container for better alignment
=======
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: "100%",
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  calendarContainer: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 300,
  },
  inputContainer: {
    flexDirection: "row",
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
>>>>>>> 68b0d88 (FINAL COMMIT)
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccccccff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
<<<<<<< HEAD
    marginRight: 10, // Add some space between input and button
    height: 40,
    width: 250, // Keep the original width
=======
    marginRight: 10,
    height: 40,
>>>>>>> 68b0d88 (FINAL COMMIT)
  },
  addBtn: {
    backgroundColor: "#b82de2ff",
    borderRadius: 50,
<<<<<<< HEAD
    padding: 10,
    height: 40, // Keep the original height
=======
    padding: 12,
>>>>>>> 68b0d88 (FINAL COMMIT)
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
<<<<<<< HEAD
  taskHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#fff" },
=======
  taskHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
>>>>>>> 68b0d88 (FINAL COMMIT)
  taskItem: {
    padding: 12,
    backgroundColor: "#CB63F8",
    borderRadius: 10,
    marginBottom: 8,
<<<<<<< HEAD
    marginHorizontal: 10, // Make task items slightly narrower for better layout
=======
    marginHorizontal: 10,
>>>>>>> 68b0d88 (FINAL COMMIT)
  },
  taskText: { fontSize: 16, color: "#fff" },
  deleteBtn: {
    marginTop: 8,
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
<<<<<<< HEAD
  deleteBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
=======
  deleteBtnText: { color: "#fff", fontWeight: "bold" },
>>>>>>> 68b0d88 (FINAL COMMIT)
  noTask: { textAlign: "center", color: "#fff", marginTop: 10 },
  navBtn: {
    marginTop: 20,
    backgroundColor: "#a02de2ff",
    paddingVertical: 12,
<<<<<<< HEAD
    paddingHorizontal: 20, // Ensure the button has consistent padding
    borderRadius: 10,
    alignItems: "center",
    width: 250,  // Keep the original width
=======
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 250,
>>>>>>> 68b0d88 (FINAL COMMIT)
  },
  navBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
