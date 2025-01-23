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
import { ref, onValue } from "firebase/database";
import { db } from "./firebaseConfig";

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  const [penyakitList, setPenyakitList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const penyakitRef = ref(db, "/penyakit");
    onValue(penyakitRef, (snapshot) => {
      const data = snapshot.val();
      const penyakitArray = data ? Object.values(data) : [];
      setPenyakitList(penyakitArray);
    });
  }, []);

  const handleSearch = (queryText) => {
    setSearchQuery(queryText);

    if (queryText.trim().length > 0) {
      const filteredResults = penyakitList.filter((penyakit) =>
        penyakit.nama.toLowerCase().includes(queryText.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <Layout>
      <TopNav
        middleContent="Penyakit"
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
          placeholder="Cari Penyakit..."
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
            { color: isDarkmode ? "#9CA3AF" : "#9CA3AF" },
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
                { backgroundColor: isDarkmode ? "#1e1e1e" : "#f0f0f0" },
              ]}
              onPress={() =>
                navigation.navigate("DetailPenyakit", { penyakit: item })
              }
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
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        searchQuery.length > 0 && (
          <Text
            style={[
              styles.noResultsText,
              { color: isDarkmode ? "#bbb" : "#999" },
            ]}
          >
            Tidak ada hasil ditemukan.
          </Text>
        )
      )}

      {searchQuery.length === 0 && (
        <FlatList
          data={penyakitList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: isDarkmode ? "#1e1e1e" : "#f0f0f0" },
              ]}
              onPress={() =>
                navigation.navigate("DetailPenyakit", { penyakit: item })
              }
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
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
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
