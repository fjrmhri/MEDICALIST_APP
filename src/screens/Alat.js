import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Layout, TopNav, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { ref, onValue, set, remove } from "firebase/database";
import { db } from "./firebaseConfig";

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  const [alatList, setAlatList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [favoritList, setFavoritList] = useState([]);

  useEffect(() => {
    const alatRef = ref(db, "/alat");
    onValue(alatRef, (snapshot) => {
      const data = snapshot.val();
      const alatArray = data ? Object.values(data) : [];
      setAlatList(alatArray);
    });

    const favoritRef = ref(db, "/favorit");
    onValue(favoritRef, (snapshot) => {
      const data = snapshot.val();
      const favoritArray = data ? Object.values(data) : [];
      setFavoritList(favoritArray);
    });
  }, []);

  const handleSearch = (queryText) => {
    setSearchQuery(queryText);

    if (queryText.trim().length > 0) {
      const filteredResults = alatList.filter((alat) =>
        alat.nama.toLowerCase().includes(queryText.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const isFavorited = (alatId) => {
    return favoritList.some((favorit) => favorit.id === alatId);
  };

  const toggleFavorite = (alat) => {
    const isFavoritedAlready = isFavorited(alat.id);

    if (isFavoritedAlready) {
      const favoritRef = ref(db, "/favorit/" + alat.id);
      remove(favoritRef)
        .then(() => {
          setFavoritList(
            favoritList.filter((favorit) => favorit.id !== alat.id)
          );
        })
        .catch((error) => {
          alert("Gagal menghapus favorit: " + error.message);
        });
    } else {
      const favoritRef = ref(db, "/favorit/" + alat.id);
      set(favoritRef, {
        ...alat,
      })
        .then(() => {
          setFavoritList([...favoritList, alat]);
        })
        .catch((error) => {
          alert("Gagal menambahkan favorit: " + error.message);
        });
    }
  };

  return (
    <Layout>
      <TopNav
        middleContent="Alat"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? "#fff" : "#000"}
          />
        }
        leftAction={() => navigation.goBack()}
      />

      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Cari Alat..."
          style={[
            styles.searchInput,
            {
              backgroundColor: isDarkmode ? "#333" : "#E5E7EB",
              color: isDarkmode ? "#fff" : "#4B5563",
            },
          ]}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Text
          style={[
            styles.searchIcon,
            { color: isDarkmode ? "#bbb" : "#9CA3AF" },
          ]}
        >
          🔍
        </Text>
      </View>

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
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
                style={[
                  styles.cardText,
                  { color: isDarkmode ? "#ddd" : "#555" },
                ]}
              >
                {item.deskripsi}
              </Text>
              <Text
                style={[
                  styles.cardText,
                  { color: isDarkmode ? "#ddd" : "#555" },
                ]}
              >{`Harga: ${item.harga}`}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        searchQuery.length > 0 && (
          <Text
            style={[
              styles.noResultsText,
              { color: isDarkmode ? "#ccc" : "#999" },
            ]}
          >
            Tidak ada hasil ditemukan.
          </Text>
        )
      )}

      {searchQuery.length === 0 && (
        <FlatList
          data={alatList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: isDarkmode ? "#1e1e1e" : "#f0f0f0" },
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
                style={[
                  styles.cardText,
                  { color: isDarkmode ? "#ddd" : "#555" },
                ]}
              >
                {item.deskripsi}
              </Text>
              <Text
                style={[
                  styles.cardText,
                  { color: isDarkmode ? "#ddd" : "#555" },
                ]}
              >{`Harga: ${item.harga}`}</Text>
              <TouchableOpacity
                style={[
                  styles.favoriteIcon,
                  { position: "absolute", top: 10, right: 16 },
                ]}
                onPress={() => toggleFavorite(item)}
              >
                <Ionicons
                  name="heart"
                  size={24}
                  color={isFavorited(item.id) ? "#ff0000" : "#fff"}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  favoriteIcon: {
    top: 1,
    right: 100,
  },
  searchWrapper: {
    marginTop: 16,
    position: "relative",
    paddingHorizontal: 16,
  },
  searchInput: {
    width: "100%",
    padding: 12,
    paddingLeft: 40,
    borderRadius: 8,
    fontFamily: "Poppins",
  },
  searchIcon: {
    position: "absolute",
    top: 5,
    left: 25,
    fontSize: 20,
    fontFamily: "Poppins",
  },
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
  noResultsText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    fontFamily: "Poppins",
  },
});
