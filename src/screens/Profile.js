import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {
  Layout,
  Text,
  Button,
  Section,
  SectionContent,
  useTheme,
} from "react-native-rapi-ui";

export default function ({ navigation }) {
  const auth = getAuth();
  const db = getFirestore();
  const [userInfo, setUserInfo] = useState(null);
  const { isDarkmode, setTheme } = useTheme();

  useEffect(() => {
    async function fetchUserInfo() {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    }
    fetchUserInfo();
  }, []);

  return (
    <Layout>
      <View
        style={{
          flex: 1,
          alignItems: "bottom",
          justifyContent: "center",
          marginHorizontal: 20,
          marginHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <Section>
          <SectionContent
            style={{
              borderRadius: 10,
              padding: 20,
              marginTop: 20,
              marginHorizontal: 10,
            }}
          >
            {userInfo && (
              <>
                <Text
                  fontWeight="bold"
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    bottom: 20,
                    marginBottom: 15,
                    marginTop: 20,
                    fontFamily: "Poppins",
                  }}
                >
                  Profile
                </Text>

                <Text
                  fontWeight="semi-bold"
                  style={{
                    marginBottom: 15,
                    fontSize: 18,
                    fontFamily: "Poppins",
                    left: 20,
                  }}
                >{`Name : ${userInfo.name}`}</Text>

                <Text
                  style={{
                    fontWeight: "semi-bold",
                    marginBottom: 15,
                    fontSize: 18,
                    fontFamily: "Poppins",
                    left: 20,
                  }}
                >{`Email : ${userInfo.email}`}</Text>

                <Text
                  style={{
                    fontWeight: "semi-bold",
                    marginBottom: 15,
                    fontSize: 18,
                    fontFamily: "Poppins",
                    left: 20,
                  }}
                >{`Phone : ${userInfo.phone}`}</Text>

                <Button
                  status="primary"
                  text="Daftar Favorit"
                  onPress={() => {
                    navigation.navigate("Favorit");
                  }}
                  style={{
                    marginTop: 30,
                  }}
                />
                <Button
                  status="danger"
                  text="Settings"
                  onPress={() => {
                    navigation.navigate("Setting");
                  }}
                  style={{
                    marginTop: 10,
                  }}
                />
              </>
            )}
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
