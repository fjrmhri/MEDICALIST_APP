import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useTheme, TopNav } from "react-native-rapi-ui";
import { LinearGradient } from "expo-linear-gradient";

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  const [chats, setChats] = useState([]);
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const chatsRef = ref(db, "chats");
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filteredChats = Object.entries(data)
          .filter(([_, messages]) =>
            Object.values(messages).some(
              (msg) => msg.sender === auth.currentUser.email
            )
          )
          .map(([apotekId, messages]) => {
            const lastMessage = Object.values(messages).pop();
            return {
              apotekId,
              apotekName: lastMessage?.apotekName || "Tidak Diketahui",
              lastMessage: lastMessage?.text,
              lastTimestamp: lastMessage?.timestamp,
            };
          });

        filteredChats.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
        setChats(filteredChats);
      } else {
        setChats([]);
      }
    });
  }, [auth.currentUser.email]);

  const handleDeleteChat = (apotekId) => {
    Alert.alert(
      "Hapus Chat",
      "Apakah Anda yakin ingin menghapus seluruh chat dengan apotek ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            const chatRef = ref(db, `chats/${apotekId}`);
            remove(chatRef).catch((error) =>
              alert("Gagal menghapus chat: " + error.message)
            );
          },
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkmode ? "#121212" : "#fff" },
      ]}
    >
      <TopNav
        style={{ marginTop: 30 }}
        middleContent="Chats"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDarkmode ? "#fff" : "#000"}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <FlatList
        data={chats}
        keyExtractor={(item) => item.apotekId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
              navigation.navigate("ChatUsers", {
                apotekId: item.apotekId,
                apotekName: item.apotekName,
              })
            }
            onLongPress={() => handleDeleteChat(item.apotekId)}
          >
            <LinearGradient
              colors={
                isDarkmode ? ["#2a2a2a", "#1f1f1f"] : ["#f0f0f0", "#e0e0e0"]
              }
              style={styles.gradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name="chatbubble-ellipses"
                  size={32}
                  color={isDarkmode ? "#fff" : "#007bff"}
                />
              </View>
              <View style={styles.chatContent}>
                <Text
                  style={[
                    styles.apotekName,
                    { color: isDarkmode ? "#fff" : "#000" },
                  ]}
                >
                  {item.apotekName}
                </Text>
                <Text
                  style={[
                    styles.lastMessage,
                    { color: isDarkmode ? "#aaa" : "#555" },
                  ]}
                >
                  {item.lastMessage}
                </Text>
                <Text
                  style={[
                    styles.senderName,
                    { color: isDarkmode ? "#aaa" : "#555" },
                  ]}
                >
                  {item.senderEmail}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text
            style={[styles.emptyText, { color: isDarkmode ? "#aaa" : "#555" }]}
          >
            Belum ada chat.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
  },
  chatItem: {
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  gradient: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
  },
  apotekName: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins",
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
  senderName: {
    fontSize: 12,
    fontFamily: "Poppins",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    fontFamily: "Poppins",
  },
});
