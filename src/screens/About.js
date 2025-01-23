import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Layout, TopNav, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  const [favoritList, setFavoritList] = useState([]);

  return (
    <Layout>
      <TopNav
        middleContent="About"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? "#fff" : "#000"}
          />
        }
        leftAction={() => navigation.goBack()}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({});
