import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { Layout, TopNav, Text, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const { isDarkmode } = useTheme();
  const [apotekList, setApotekList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const db = getDatabase();
    const apotekRef = ref(db, "apotek");
    onValue(apotekRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setApotekList(data);
      }
    });
  }, []);

  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <Layout>
      <TopNav
        middleContent="Apotek"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDarkmode ? "#fff" : "#000"}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <FlatList
          data={apotekList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: isDarkmode ? "#2D2D2D" : "#FFF" },
              ]}
              onPress={() =>
                navigation.navigate("DetailApotek", { apotek: item })
              }
            >
              <View>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: isDarkmode ? "#fff" : "#333" },
                  ]}
                >
                  {item.name} {}
                </Text>
                <Text
                  style={{
                    color: isDarkmode ? "#bbb" : "#555",
                    fontSize: 14,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  {item.address} {}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => openGoogleMaps(item.latitude, item.longitude)}
              >
                <Ionicons
                  name="location-sharp"
                  size={27}
                  color={isDarkmode ? "#4DA8DA" : "#007AFF"}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    fontFamily: "Poppins",
  },
  icon: {
    marginLeft: 10,
  },
});
