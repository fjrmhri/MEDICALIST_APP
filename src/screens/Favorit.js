import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Layout, TopNav, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { ref, remove, onValue } from "firebase/database";
import { db } from "./firebaseConfig";

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  const [favoritList, setFavoritList] = useState([]);
  const [filter, setFilter] = useState("Obat");

  useEffect(() => {
    const favoritRef = ref(db, "/favorit");
    onValue(favoritRef, (snapshot) => {
      const data = snapshot.val();
      const favoritArray = data ? Object.values(data) : [];
      setFavoritList(favoritArray);
    });
  }, []);

  const unfavorite = (alatId) => {
    const favoritRef = ref(db, "/favorit/" + alatId);
    remove(favoritRef)
      .then(() => {
        setFavoritList(favoritList.filter((favorit) => favorit.id !== alatId));
      })
      .catch((error) => {
        alert("Gagal menghapus favorit: " + error.message);
      });
  };
  const filteredList = favoritList.filter((item) => item.jenis === filter);

  return (
    <Layout>
      <TopNav
        middleContent="Favorit"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? "#fff" : "#000"}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "Obat" && styles.activeObatButton,
          ]}
          onPress={() => setFilter("Obat")}
        >
          <Text
            style={[styles.filterText, filter === "Obat" && styles.activeText]}
          >
            Obat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "Alat" && styles.activeAlatButton,
          ]}
          onPress={() => setFilter("Alat")}
        >
          <Text
            style={[styles.filterText, filter === "Alat" && styles.activeText]}
          >
            Alat
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={favoritList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: isDarkmode ? "#444" : "#f0f0f0" },
            ]}
            onPress={() => navigation.navigate("DetailAlat", { alat: item })}
          >
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkmode ? "#fff" : "#333" },
              ]}
            >
              {item.nama}
            </Text>
            <Text
              style={[styles.cardText, { color: isDarkmode ? "#ddd" : "#555" }]}
            >
              {item.deskripsi}
            </Text>
            <TouchableOpacity
              style={styles.unfavoriteIcon}
              onPress={() => unfavorite(item.id)}
            >
              <Ionicons
                name="heart-dislike"
                size={24}
                color={isDarkmode ? "#fff" : "#ff0000"}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 15,
    borderRadius: 8,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    fontFamily: "Poppins",
  },
  cardText: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
  unfavoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#E0E0E0", // Warna default tombol
    alignItems: "center",
  },
  activeObatButton: {
    backgroundColor: "#FF4D4D", // Warna tombol aktif untuk Obat
  },
  activeAlatButton: {
    backgroundColor: "#007AFF", // Warna tombol aktif untuk Alat
  },
  filterText: {
    color: "#555",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Poppins",
  },
  activeText: {
    color: "#FFFFFF", // Warna teks tombol aktif
  },
});
