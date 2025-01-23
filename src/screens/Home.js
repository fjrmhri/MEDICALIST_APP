import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Layout, useTheme } from "react-native-rapi-ui";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getDatabase, ref, get } from "firebase/database";
import { db } from "./firebaseConfig";
import * as Location from "expo-location";
import haversine from "haversine";
import { Ionicons } from "@expo/vector-icons";

const auth = getAuth();
const firestore = getFirestore();

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [location, setLocation] = useState(null);
  const [nearestPharmacies, setNearestPharmacies] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserName(userData.name || "User");
          setUserPhone(userData.phone || "Unknown");
        } else {
          console.log("No such document!");
        }
      } else {
        setUserName("User");
        setUserPhone("Unknown");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchNearestPharmacies(location.coords);
    })();
  }, []);

  const fetchNearestPharmacies = async (userCoords) => {
    const snapshot = await get(ref(db, "apotek"));
    const apotekData = snapshot.val();

    if (apotekData) {
      const apoteks = Object.values(apotekData);
      const nearest = apoteks
        .map((apotek) => ({
          ...apotek,
          distance: haversine(userCoords, {
            latitude: apotek.latitude,
            longitude: apotek.longitude,
          }),
        }))
        .sort((a, b) => a.distance - b.distance);
      setNearestPharmacies(nearest);
    }
  };

  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={[
            styles.header,
            { backgroundColor: isDarkmode ? "#222" : "#0471CA50" },
          ]}
        >
          <View>
            <Image
              source={require("../../assets/logohome.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.welcomeText,
                { color: isDarkmode ? "#fff" : "#000" },
              ]}
            >
              Hello,
            </Text>
            <Text
              style={[
                styles.userNameText,
                { color: isDarkmode ? "#fff" : "#000" },
              ]}
            >
              {userName}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate("Chat")}
          >
            <MaterialCommunityIcons
              name="android-messages"
              size={27}
              color={isDarkmode ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.kategoriw,
            { backgroundColor: isDarkmode ? "#333" : "#F1F1F1" },
          ]}
        >
          <View style={styles.kategoriitem}>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate("Obat")}
            >
              <MaterialCommunityIcons name="pill" size={35} color="#FF2323" />
            </TouchableOpacity>
            <Text
              style={[
                styles.kategoritext,
                { color: isDarkmode ? "#fff" : "#000" },
              ]}
            >
              Obat
            </Text>
          </View>

          <View style={styles.kategoriitem}>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate("Penyakit")}
            >
              <MaterialCommunityIcons name="virus" size={35} color="#38A61D" />
            </TouchableOpacity>
            <Text
              style={[
                styles.kategoritext,
                { color: isDarkmode ? "#fff" : "#000" },
              ]}
            >
              Penyakit
            </Text>
          </View>

          <View style={styles.kategoriitem}>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate("Alat")}
            >
              <MaterialCommunityIcons
                name="stethoscope"
                size={35}
                color="#69B0F2"
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.kategoritext,
                { color: isDarkmode ? "#fff" : "#000" },
              ]}
            >
              Alat
            </Text>
          </View>

          <View style={styles.kategoriitem}>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate("Apotek")}
            >
              <MaterialCommunityIcons
                name="hospital-building"
                size={35}
                color="#52565A"
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.kategoritext,
                { color: isDarkmode ? "#fff" : "#000" },
              ]}
            >
              Apotek
            </Text>
          </View>
        </View>

        <View style={styles.berita}>
          <Text
            style={[styles.beritaText, { color: isDarkmode ? "#fff" : "#000" }]}
          >
            Apotek Terdekat
          </Text>
          {nearestPharmacies.length > 0 ? (
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.tableContainer}>
                {nearestPharmacies.slice(0, 3).map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("DetailApotek", { apotek: item })
                        }
                      >
                        <Text style={{ color: isDarkmode ? "#fff" : "#000" }}>
                          {item.name}
                        </Text>
                        <Text style={{ color: isDarkmode ? "#aaa" : "#555" }}>
                          {item.address}
                        </Text>
                        <Text style={{ color: isDarkmode ? "#aaa" : "#555" }}>
                          {item.distance.toFixed(2)} km
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() =>
                        openGoogleMaps(item.latitude, item.longitude)
                      }
                    >
                      <Ionicons
                        name="location-sharp"
                        size={24}
                        color={isDarkmode ? "#4DA8DA" : "#007AFF"}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <Text style={{ color: isDarkmode ? "#fff" : "#000" }}>...</Text>
          )}

          <View>
            <TouchableOpacity
              style={styles.buttonLainnya}
              onPress={() => {
                navigation.navigate("Apotek");
              }}
            >
              <Text style={{ color: isDarkmode ? "#fff" : "#000" }}>
                Lainnya
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0471CA50",
    marginHorizontal: -20,
    marginTop: -50,
    padding: 30,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: -30,
    left: -7,
  },
  welcomeText: {
    fontFamily: "Poppins",
    fontSize: 15,
    textAlign: "left",
  },
  userNameText: {
    fontFamily: "Poppins",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -5,
  },
  kategoriw: {
    padding: 15,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    marginHorizontal: -20,
    bottom: 10,
    backgroundColor: "#F1F1F1",
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kategoriitem: {
    bottom: -5,
    flex: 1,
    alignItems: "center",
  },
  kategoritext: {
    fontSize: 14,
    fontFamily: "Poppins",
    bottom: 10,
  },
  berita: {
    marginTop: 32,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  beritaText: {
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "Poppins",
    left: -110,
    top: -20,
  },
  chatButton: {
    padding: 10,
    bottom: 3,
  },
  scrollContainer: {
    width: "100%",
  },
  tableContainer: {
    width: "100%",
    marginTop: -15,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    textAlign: "left",
    fontFamily: "Poppins",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
