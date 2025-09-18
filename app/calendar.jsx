import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ImageBackground
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Link } from "expo-router";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState({});

  const addTask = () => {
    if (task && selectedDate) {
      const updatedTasks = { ...tasks };
      if (!updatedTasks[selectedDate]) updatedTasks[selectedDate] = [];
      updatedTasks[selectedDate].push(task);
      setTasks(updatedTasks);
      setTask("");
    }
  };

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
            style={{ height: 300, width: '100%' }} // Resizing the calendar
          />
        </View>

        {/* Task Input Section */}
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
          data={tasks[selectedDate] || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>📝 {item}</Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteTask(selectedDate, index)}
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

        {/* Navigation Button */}
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
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccccccff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginRight: 10, // Add some space between input and button
    height: 40,
    width: 250, // Keep the original width
  },
  addBtn: {
    backgroundColor: "#b82de2ff",
    borderRadius: 50,
    padding: 10,
    height: 40, // Keep the original height
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  taskHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#fff" },
  taskItem: {
    padding: 12,
    backgroundColor: "#CB63F8",
    borderRadius: 10,
    marginBottom: 8,
    marginHorizontal: 10, // Make task items slightly narrower for better layout
  },
  taskText: { fontSize: 16, color: "#fff" },
  deleteBtn: {
    marginTop: 8,
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noTask: { textAlign: "center", color: "#fff", marginTop: 10 },
  navBtn: {
    marginTop: 20,
    backgroundColor: "#a02de2ff",
    paddingVertical: 12,
    paddingHorizontal: 20, // Ensure the button has consistent padding
    borderRadius: 10,
    alignItems: "center",
    width: 250,  // Keep the original width
  },
  navBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
