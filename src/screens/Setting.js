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
            <Text
              fontWeight="bold"
              style={{
                textAlign: "center",
                fontSize: 20,

                marginBottom: 15,
              }}
            >
              Setting
            </Text>
            <Button
              status="primary"
              text="About"
              onPress={() => {
                navigation.navigate("About");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              status="primary"
              text="Change Theme"
              onPress={() => {
                isDarkmode ? setTheme("light") : setTheme("dark");
              }}
              style={{
                marginTop: 15,
                padding: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            />
            <Button
              status="primary"
              text="Kembali"
              onPress={() => {
                navigation.navigate("Profile");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              status="danger"
              text="Logout"
              onPress={() => {
                signOut(auth);
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
