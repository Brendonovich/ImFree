import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {login} from "store/actions/authActions";

const displayWidth = Dimensions.get("window").width;

const Login = () => {
  const dispatch = useDispatch();

  const loginError = useSelector((s: AppState) => s.auth.error);

  const handleLogin = () => {
    dispatch(login());
  };

  return (
    <SafeAreaView style={styles.loginView}>
      <View style={styles.content}>
        <Text style={{ fontSize: 40 }}>ImFree</Text>

        <TouchableHighlight onPress={handleLogin}>
          <Image source={require("../assets/fbLogin.png")} style={styles.fblogin}/>
        </TouchableHighlight>

        <Text style={{ color: "red" }}>{loginError}</Text>
      </View>
      
      <Text style={styles.bottom}>Made By Brendan Allan</Text>
      
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  loginView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  content: {
    width: displayWidth,
    height: 150,
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "auto"
  },
  fblogin: {
    height: 50,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue"
  },
  bottom: {
    marginTop: "auto",
    alignItems: "center",
    marginBottom: 20
  }
});
