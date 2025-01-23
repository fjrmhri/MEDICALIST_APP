import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme, themeColor } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";
//untuk screens
import First from "../screens/blank/First";
import Home from "../screens/Home";
import Obat from "../screens/Obat";
import Alat from "../screens/Alat";
import Penyakit from "../screens/Penyakit";
import Apotek from "../screens/Apotek";
import About from "../screens/About";
import Profile from "../screens/Profile";
import Loading from "../screens/utils/Loading";
import DetailObat from "../screens/DetailObat";
import DetailAlat from "../screens/DetailAlat";
import DetailPenyakit from "../screens/DetailPenyakit";
import DetailApotek from "../screens/DetailApotek";
import Setting from "../screens/Setting";
import ChatAdmin from "../screens/ChatAdmin";
import Favorit from "../screens/Favorit";
import ErrorBoundary from "../screens/ErrorBoundary";
import ChatUsers from "../screens/ChatUsers";
// untuk Auth screens
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";
import { AuthContext } from "../provider/AuthProvider";

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="First" component={First} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
    </AuthStack.Navigator>
  );
};

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="Obat" component={Obat} />
      <MainStack.Screen name="Alat" component={Alat} />
      <MainStack.Screen name="Penyakit" component={Penyakit} />
      <MainStack.Screen name="Apotek" component={Apotek} />
      <MainStack.Screen name="DetailObat" component={DetailObat} />
      <MainStack.Screen name="DetailAlat" component={DetailAlat} />
      <MainStack.Screen name="DetailPenyakit" component={DetailPenyakit} />
      <MainStack.Screen name="DetailApotek" component={DetailApotek} />
      <MainStack.Screen name="About" component={About} />
      <MainStack.Screen name="Setting" component={Setting} />
      <MainStack.Screen name="Chat" component={ChatAdmin} />
      <MainStack.Screen name="Favorit" component={Favorit} />
      <MainStack.Screen name="ChatUsers" component={ChatUsers} />
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const { isDarkmode } = useTheme();
  const iconSize = 24;
  const PenyakiticonSize = 21;
  const ApotekIconSize = 22;
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Home" />
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="home"
              size={iconSize}
              color={focused ? themeColor.primary : themeColor.gray}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Obat"
        component={Obat}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Obat" />
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="pill"
              size={iconSize}
              color={focused ? themeColor.primary : themeColor.gray}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Penyakit"
        component={Penyakit}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Penyakit" />
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="virus"
              size={PenyakiticonSize}
              color={focused ? themeColor.primary : themeColor.gray}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Alat"
        component={Alat}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Alat" />
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="stethoscope"
              size={ApotekIconSize}
              color={focused ? themeColor.primary : themeColor.gray}
              top={1}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Profile" />
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account"
              size={iconSize}
              color={focused ? themeColor.primary : themeColor.gray}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default () => {
  const auth = useContext(AuthContext);
  const user = auth.user;
  return (
    <ErrorBoundary>
      <NavigationContainer>
        {user === null && <Loading />}
        {user === false && <Auth />}
        {user === true && <Main />}
      </NavigationContainer>
    </ErrorBoundary>
  );
};
