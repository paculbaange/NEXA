import { Stack, Tabs } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FlashcardsProvider } from "./FlashcardsContext"; // ✅ correct path

export default function Layout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  return (
    <FlashcardsProvider>
      {!user ? (
        // 🚫 Not logged in → show only Stack (no bottom nav at all)
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
        </Stack>
      ) : (
        // ✅ Logged in → show Tabs (with bottom nav bar)
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#fff",
            tabBarInactiveTintColor: "#ddd",
            tabBarStyle: {
              backgroundColor: "#534953ff",
              borderTopWidth: 0,
              height: 50,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "bold",
            },
          }}
        >
          {/* 1. Dictionary */}
          <Tabs.Screen
            name="dashboard"
            options={{
              title: "Dictionary",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="book" size={size} color={color} />
              ),
            }}
          />

          {/* 2. Feed */}
          <Tabs.Screen
            name="feed"
            options={{
              title: "Feed",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list" size={size} color={color} />
              ),
            }}
          />

          {/* 3. Library */}
          <Tabs.Screen
            name="library"
            options={{
              title: "Library",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="library-outline" size={size} color={color} />
              ),
            }}
          />

          {/* 4. Profile */}
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="person-circle-outline"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          {/* Hidden routes → available but not shown in the tab bar */}
          <Tabs.Screen name="create" options={{ href: null }} />
          <Tabs.Screen name="edit" options={{ href: null }} />
          <Tabs.Screen name="goals" options={{ href: null }} />
          <Tabs.Screen name="calendar" options={{ href: null }} />

          {/* 🚫 Hide index/login/signup when logged in */}
          <Tabs.Screen name="index" options={{ href: null }} />
          <Tabs.Screen name="login" options={{ href: null }} />
          <Tabs.Screen name="signup" options={{ href: null }} />
        </Tabs>
      )}
    </FlashcardsProvider>
  );
}
