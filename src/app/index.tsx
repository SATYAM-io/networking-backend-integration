import Constants from "expo-constants";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface User {
  id: string | number;
  name: string;
  email: string;
}

// Dynamically resolve base URL for both Web and Native platforms
const getApiUrl = (path: string) => {
  if (Platform.OS === "web") {
    return path;
  }
  const host = Constants.expoConfig?.hostUri?.split(":")?.[0] || "127.0.0.1";
  return `http://${host}:8081${path}`;
};

export default function Index() {
  const [users, setUsers] = useState<User[]>([]);
  const [getOutput, setGetOutput] = useState<string>("No request made yet");
  const [postOutput, setPostOutput] = useState<string>("No request made yet");
  const [patchOutput, setPatchOutput] = useState<string>("No request made yet");
  const [deleteOutput, setDeleteOutput] = useState<string>(
    "No request made yet",
  );

  // GET Users
  const handleGet = async () => {
    try {
      const url = getApiUrl("/api/users");
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data);
      setGetOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setGetOutput(`Error: ${err.message}`);
    }
  };

  // POST User
  const handlePost = async () => {
    try {
      const url = getApiUrl("/api/users");
      const testName = `User ${Math.floor(Math.random() * 1000)}`;
      const testEmail = `${testName.toLowerCase().replace(/\s+/g, "")}@example.com`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: testName, email: testEmail }),
      });
      const data = await res.json();
      setPostOutput(JSON.stringify(data, null, 2));
      // Refresh list
      handleGet();
    } catch (err: any) {
      setPostOutput(`Error: ${err.message}`);
    }
  };

  // PATCH User (Updates the first user in the list)
  const handlePatch = async () => {
    if (users.length === 0) {
      setPatchOutput(
        "Error: No users available to update. Please fetch or create a user first.",
      );
      return;
    }
    const firstUser = users[0];
    try {
      const url = getApiUrl(`/api/users/${firstUser.id}`);
      const updatedName = `${firstUser.name} (Updated)`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: updatedName, email: firstUser.email }),
      });
      const data = await res.json();
      setPatchOutput(JSON.stringify(data, null, 2));
      // Refresh list
      handleGet();
    } catch (err: any) {
      setPatchOutput(`Error: ${err.message}`);
    }
  };

  // DELETE User (Deletes the first user in the list)
  const handleDelete = async () => {
    if (users.length === 0) {
      setDeleteOutput(
        "Error: No users available to delete. Please fetch or create a user first.",
      );
      return;
    }
    const firstUser = users[0];
    try {
      const url = getApiUrl(`/api/users/${firstUser.id}`);
      const res = await fetch(url, {
        method: "DELETE",
      });
      const data = await res.json();
      setDeleteOutput(JSON.stringify(data, null, 2));
      // Refresh list
      handleGet();
    } catch (err: any) {
      setDeleteOutput(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    handleGet();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{ title: "API Calling Demo", headerShown: false }}
      />

      <Text style={styles.title}>API Testing Dashboard</Text>
      <Text style={styles.subtitle}>
        Direct backend calls and live response output
      </Text>

      {/* GET */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.methodGet}>GET</Text>
          <Text style={styles.route}>/api/users</Text>
        </View>
        <Pressable style={styles.button} onPress={handleGet}>
          <Text style={styles.buttonText}>Fetch Users</Text>
        </Pressable>
        <Text style={styles.label}>Response Output:</Text>
        <ScrollView style={styles.outputBox} nestedScrollEnabled={true}>
          <Text style={styles.outputText}>{getOutput}</Text>
        </ScrollView>
      </View>

      {/* POST */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.methodPost}>POST</Text>
          <Text style={styles.route}>/api/users</Text>
        </View>
        <Pressable style={styles.button} onPress={handlePost}>
          <Text style={styles.buttonText}>Create Random User</Text>
        </Pressable>
        <Text style={styles.label}>Response Output:</Text>
        <ScrollView style={styles.outputBox} nestedScrollEnabled={true}>
          <Text style={styles.outputText}>{postOutput}</Text>
        </ScrollView>
      </View>

      {/* PATCH */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.methodPatch}>PATCH</Text>
          <Text style={styles.route}>/api/users/[id]</Text>
        </View>
        <Pressable
          style={[styles.button, users.length === 0 && styles.disabledButton]}
          onPress={handlePatch}
        >
          <Text style={styles.buttonText}>Update First User</Text>
        </Pressable>
        <Text style={styles.label}>Response Output:</Text>
        <ScrollView style={styles.outputBox} nestedScrollEnabled={true}>
          <Text style={styles.outputText}>{patchOutput}</Text>
        </ScrollView>
      </View>

      {/* DELETE */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.methodDelete}>DELETE</Text>
          <Text style={styles.route}>/api/users/[id]</Text>
        </View>
        <Pressable
          style={[styles.button, users.length === 0 && styles.disabledButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete First User</Text>
        </Pressable>
        <Text style={styles.label}>Response Output:</Text>
        <ScrollView style={styles.outputBox} nestedScrollEnabled={true}>
          <Text style={styles.outputText}>{deleteOutput}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === "android" ? 50 : 30,
    paddingBottom: 50,
  },
  title: {
    color: "#F3F4F6",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 25,
    marginTop: 5,
  },
  card: {
    backgroundColor: "#161D30",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#232D48",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  methodGet: {
    color: "#10B981",
    fontWeight: "bold",
    fontSize: 13,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 10,
  },
  methodPost: {
    color: "#3B82F6",
    fontWeight: "bold",
    fontSize: 13,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 10,
  },
  methodPatch: {
    color: "#F59E0B",
    fontWeight: "bold",
    fontSize: 13,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 10,
  },
  methodDelete: {
    color: "#EF4444",
    fontWeight: "bold",
    fontSize: 13,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 10,
  },
  route: {
    color: "#E5E7EB",
    fontWeight: "600",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: "#1F2937",
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  label: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  outputBox: {
    backgroundColor: "#0B0F19",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#1F2937",
    maxHeight: 150,
  },
  outputText: {
    color: "#10B981",
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 12,
  },
});
