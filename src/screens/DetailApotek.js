import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Layout, TopNav, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default function ({ route, navigation }) {
  const { isDarkmode } = useTheme();
  const { apotek } = route.params;

  const handleChatPress = () => {
    navigation.navigate("ChatUsers", {
      apotekId: apotek.id,
      apotekName: apotek.name,
    });
  };

  return (
    <Layout>
      <TopNav
        middleContent="Detail Apotek"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDarkmode ? "#fff" : "#000"}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: isDarkmode ? "#121212" : "#f8f9fa" },
        ]}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: isDarkmode ? "#1e1e1e" : "#fff" },
          ]}
        >
          <Text style={[styles.title, { color: isDarkmode ? "#fff" : "#333" }]}>
            {apotek.name}
          </Text>
          <Text style={[styles.label, { color: isDarkmode ? "#bbb" : "#555" }]}>
            Alamat:
          </Text>
          <Text
            style={[styles.content, { color: isDarkmode ? "#ddd" : "#777" }]}
          >
            {apotek.address}
          </Text>
          <Text style={[styles.label, { color: isDarkmode ? "#bbb" : "#555" }]}>
            Telepon:
          </Text>
          <Text
            style={[styles.content, { color: isDarkmode ? "#ddd" : "#777" }]}
          >
            {apotek.phone}
          </Text>
          <Text style={[styles.label, { color: isDarkmode ? "#bbb" : "#555" }]}>
            Jam Operasional:
          </Text>
          <Text
            style={[styles.content, { color: isDarkmode ? "#ddd" : "#777" }]}
          >
            {apotek.hours}
          </Text>
          <TouchableOpacity
            style={[
              styles.chatButton,
              { backgroundColor: isDarkmode ? "#007bff" : "#007bff" },
            ]}
            onPress={handleChatPress}
          >
            <Text style={styles.chatText}>Chat dengan Apotek</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
  },
  card: {
    padding: 20,
    borderRadius: 10,
    width: "100%",
    elevation: 6,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    fontFamily: "Poppins",
  },
  content: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 15,
    textAlign: "justify",
    fontFamily: "Poppins",
  },
  chatButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  chatText: {
    color: "#fff",
    fontSize: 16,
  },
});
