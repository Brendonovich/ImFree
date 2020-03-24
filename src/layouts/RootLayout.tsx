import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector, useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";

import firebase from "utils/firebase";
import { setUser } from "store/actions/authActions";
import { setPersonalInfo } from "store/actions/dataActions";

import LoginLayout from "./Login";
import MainLayout from "./MainLayout";
import SettingsLayout from "./Settings";

const MainStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

const CalendarStack = createStackNavigator();
const CalendarScreen = () => (
  <CalendarStack.Navigator>
    <CalendarStack.Screen name="Calendar" component={MainLayout} />
  </CalendarStack.Navigator>
);

const SettingsStack = createStackNavigator();
const SettingsScreen = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen name="Settings" component={SettingsLayout} />
  </SettingsStack.Navigator>
);

export default () => {
  const dispatch = useDispatch();

  const user = useSelector((s: AppState) => s.auth.user);
  const authLoading = useSelector((s: AppState) => s.auth.authLoading);
  const setupLoading = useSelector((s: AppState) => s.auth.setupLoading)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      dispatch(setUser(user));
      if(user)
        dispatch(setPersonalInfo(user));
    });
  }, []);

  if (setupLoading || authLoading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  return (
    <NavigationContainer>
      {!user ? (
        <MainStack.Navigator>
          <MainStack.Screen
            name="Login"
            component={LoginLayout}
            options={{ headerShown: false }}
          />
        </MainStack.Navigator>
      ) : (
        <MainTab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === "Calendar") {
                iconName = "calendar";
              } else if (route.name === "Settings") {
                iconName = "setting";
              }
              return <AntDesign name={iconName} size={size} color={color} />;
            }
          })}
        >
          <MainTab.Screen name="Calendar" component={CalendarScreen} />
          <MainTab.Screen name="Settings" component={SettingsScreen} />
        </MainTab.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  }
});
