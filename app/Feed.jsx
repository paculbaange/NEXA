import React, { useState } from "react"; 
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

// List of random users
const users = [
  "Alice", "Bob", "Charlie", "Diana", "Ethan",
  "Fiona", "George", "Hannah", "Ivan", "Jade",
];

// Example feed data with 15 posts and random "postedBy"
const initialPosts = [
  {
    id: "1",
    title: "The Importance of Daily Reading",
    description:
      "Reading for just 20 minutes a day improves your focus, memory, and knowledge. Try reading before bed to make it a habit.",
    comments: ["I started reading at night, and my sleep improved!", "So true, books are life 📚"],
  },
  {
    id: "2",
    title: "Learn One New Word a Day",
    description:
      "Expanding your vocabulary makes communication more effective. Write down one new word every day and use it in a sentence.",
    comments: ["Today's word: serendipity ✨", "I use flashcards for this!"],
  },
  {
    id: "3",
    title: "Mind Mapping for Learning",
    description:
      "Mind maps help you visualize connections between ideas, making studying and note-taking more effective.",
    comments: ["Mind maps saved me in exams!", "I use colors to make mine fun 🎨"],
  },
  {
    id: "4",
    title: "Practice Active Recall",
    description:
      "Instead of just re-reading notes, try recalling information from memory. This strengthens long-term retention.",
    comments: ["Yes! I quiz myself daily.", "Active recall > passive reading any day!"],
  },
  {
    id: "5",
    title: "Teach Someone Else",
    description:
      "Explaining a concept to another person is one of the most effective ways to learn. Teaching forces you to simplify and clarify ideas.",
    comments: ["I taught my sister math, and I understood it better myself 😂", "Teaching is learning twice!"],
  },
  {
    id: "6",
    title: "Take Short Breaks",
    description:
      "Pomodoro technique suggests 25 minutes of focus followed by a 5-minute break. It prevents burnout and keeps your brain fresh.",
    comments: ["I love using timers ⏲️", "Breaks with music are the best!"],
  },
  {
    id: "7",
    title: "Use Mnemonics",
    description:
      "Mnemonics help you remember complex information by associating it with familiar patterns.",
    comments: ["Mnemonics saved me in history exams!", "I make up silly phrases to memorize things."],
  },
  {
    id: "8",
    title: "Stay Hydrated",
    description:
      "Drinking water regularly improves brain function and focus.",
    comments: ["I keep a bottle at my desk!", "Hydration is key 🔑"],
  },
  {
    id: "9",
    title: "Set Realistic Goals",
    description:
      "Setting small, achievable goals helps you stay motivated and track progress.",
    comments: ["Breaking tasks into chunks really helps.", "I use a planner for my goals."],
  },
  {
    id: "10",
    title: "Review and Reflect",
    description:
      "Regularly reviewing what you’ve learned helps reinforce knowledge and identify gaps.",
    comments: ["Reflection is powerful!", "I journal my study sessions."],
  },
  // New 5 posts
  {
    id: "11",
    title: "Healthy Study Snacks",
    description:
      "Eating brain-boosting snacks like nuts and berries can improve concentration during study sessions.",
    comments: ["I love almonds!", "Snacking smart is key."],
  },
  {
    id: "12",
    title: "Create a Dedicated Study Space",
    description:
      "Having a quiet, organized place just for studying can help increase focus and reduce distractions.",
    comments: ["My desk setup makes a huge difference!", "I keep mine clutter-free."],
  },
  {
    id: "13",
    title: "Use Technology Wisely",
    description:
      "Apps and digital tools can boost productivity but avoid social media distractions.",
    comments: ["Forest app helps me stay focused!", "I block notifications when studying."],
  },
  {
    id: "14",
    title: "Practice Mindfulness",
    description:
      "Taking a few minutes to meditate or do breathing exercises can reduce stress and improve concentration.",
    comments: ["Meditation changed my study game!", "Deep breaths really help."],
  },
  {
    id: "15",
    title: "Stay Consistent",
    description:
      "Consistency beats cramming. Studying a little every day leads to better long-term retention.",
    comments: ["Small daily sessions > all-nighters.", "Routine is everything!"],
  },
];

// Assign random "postedBy" user to each post
const postsWithUsers = initialPosts.map(post => ({
  ...post,
  postedBy: users[Math.floor(Math.random() * users.length)],
}));

export default function Feed() {
  const [posts, setPosts] = useState(postsWithUsers);
  const [commentText, setCommentText] = useState("");
  const [activePost, setActivePost] = useState(null);

  const addComment = (postId) => {
    if (!commentText.trim()) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, commentText] }
          : post
      )
    );

    setCommentText("");
    setActivePost(null);
  };

  // Refresh posts to initial with random users
  const refreshFeed = () => {
    const refreshed = initialPosts.map(post => ({
      ...post,
      postedBy: users[Math.floor(Math.random() * users.length)],
    }));
    setPosts(refreshed);
    setActivePost(null);
    setCommentText("");
  };

  const renderPost = ({ item }) => (
    <View style={styles.post}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBy}>Posted by: {item.postedBy}</Text>
      <Text style={styles.postDescription}>{item.description}</Text>

      {item.comments.map((c, i) => (
        <Text key={i} style={styles.comment}>
          💬 {c}
        </Text>
      ))}

      {activePost === item.id ? (
        <View style={styles.commentBox}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor="#888"
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity
            style={styles.commentButton}
            onPress={() => addComment(item.id)}
          >
            <Text style={styles.commentButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addCommentButton}
          onPress={() => setActivePost(item.id)}
        >
          <Text style={styles.addCommentText}>+ Add Comment</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#6f42c1" />
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>Feed</Text>
        <TouchableOpacity onPress={refreshFeed} style={styles.refreshBtn}>
          <Text style={styles.refreshText}>⟳</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f8f8" },
  navbar: {
    height: 56,
    backgroundColor: "#6f42c1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: "relative",
  },
  navTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  refreshBtn: {
    position: "absolute",
    right: 16,
    padding: 8,
  },
  refreshText: {
    color: "#fff",
    fontSize: 24,
  },
  post: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  postTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 2 },
  postBy: { fontSize: 12, color: "#777", marginBottom: 8, fontStyle: "italic" },
  postDescription: { fontSize: 14, color: "#555", marginBottom: 10 },
  comment: { fontSize: 13, color: "#333", marginLeft: 10, marginBottom: 4 },
  commentBox: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
  },
  commentButton: {
    backgroundColor: "#9333EA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  commentButtonText: { color: "#fff", fontWeight: "600" },
  addCommentButton: { marginTop: 8 },
  addCommentText: { color: "#9333EA", fontWeight: "600" },
});
