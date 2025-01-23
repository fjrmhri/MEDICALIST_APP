import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Layout, TopNav, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { getDatabase, ref, onValue, push } from "firebase/database";
import { getAuth } from "firebase/auth";

export default function ({ route, navigation }) {
  const { isDarkmode } = useTheme();
  const { apotekId, apotekName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const messagesRef = ref(db, `chats/${apotekId}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatMessages = Object.values(data);
        setMessages(chatMessages);
      } else {
        setMessages([]);
      }
    });
  }, [apotekId]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const messagesRef = ref(db, `chats/${apotekId}`);
    push(messagesRef, {
      text: newMessage,
      sender: auth.currentUser.displayName || auth.currentUser.email,
      senderEmail: auth.currentUser.email,
      timestamp: Date.now(),
      apotekName,
    });
    setNewMessage("");
  };

  return (
    <Layout>
      <TopNav
        middleContent={` ${apotekName}`}
        leftContent={
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDarkmode ? "#fff" : "#000"}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkmode ? "#121212" : "#fff" },
        ]}
      >
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                item.sender ===
                (auth.currentUser.displayName || auth.currentUser.email)
                  ? styles.userMessage
                  : styles.apotekMessage,
                { backgroundColor: isDarkmode ? "#2a2a2a" : "#f0f0f0" },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: isDarkmode ? "#fff" : "#000" },
                ]}
              >
                {item.sender ===
                (auth.currentUser.displayName || auth.currentUser.email)
                  ? `You: ${item.text}`
                  : `${item.sender}: ${item.text}`}
              </Text>
            </View>
          )}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Tulis pesan..."
            placeholderTextColor={isDarkmode ? "#ccc" : "#888"}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendText}>Kirim</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d1f5d3",
  },
  apotekMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  sendText: {
    color: "#fff",
  },
});
