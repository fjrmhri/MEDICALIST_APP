import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Layout, Text, useTheme } from "react-native-rapi-ui";

export default function Navigation() {
  const navigation = useNavigation();
  const { isDarkmode } = useTheme();

  const [isLoginPressed, setLoginPressed] = useState(false);
  const [isRegisterPressed, setRegisterPressed] = useState(false);

  return (
    <Layout>
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          style={styles.logo}
          source={require("../../../assets/logoteks.png")}
        />
        <View style={{ marginTop: 20 }}>
          {}
          <TouchableOpacity
            style={[
              styles.button,
              isLoginPressed
                ? styles.buttonPressed
                : { backgroundColor: isDarkmode ? "#0471ca" : "#0471ca" },
            ]}
            onPress={() => navigation.navigate("Login")}
            onPressIn={() => setLoginPressed(true)}
            onPressOut={() => setLoginPressed(false)}
          >
            <Text
              style={[
                styles.buttonText,
                isLoginPressed ? styles.buttonTextPressed : { color: "#fff" },
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>

          {}
          <TouchableOpacity
            style={[
              styles.button,
              isRegisterPressed
                ? styles.buttonPressed
                : { backgroundColor: isDarkmode ? "#0000" : "#0000" },
            ]}
            onPress={() => navigation.navigate("Register")}
            onPressIn={() => setRegisterPressed(true)}
            onPressOut={() => setRegisterPressed(false)}
          >
            <Text
              style={[
                styles.buttonText,
                isRegisterPressed
                  ? styles.buttonTextPressed
                  : { color: "#0471ca" },
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  logo: {
    height: 300,
    width: 300,
    left: 10,
    bottom: 50,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#0471ca",
    alignItems: "center",
    width: 200,
    bottom: 110,
  },
  buttonPressed: {
    backgroundColor: "#0471CA",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Poppins",
  },
  buttonTextPressed: {
    color: "#fff",
  },
});
