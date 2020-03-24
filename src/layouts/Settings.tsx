import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Text,
  Button,
  Animated,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Constants from "expo-constants"

import ProfileImage from "components/ProfileImage";
import FriendSelector from "components/FriendSelector";

import { fetchFriends } from "store/actions/dataActions";
import { signOut } from "store/actions/authActions";
import { auth } from "utils/firebase";
import WhitelistSelector from "components/WhitelistSelector";

const displayWidth = Dimensions.get("screen").width;

export default () => {
  const currentUser: firebase.User = useSelector((s: AppState) => s.auth.user);
  const userInfo: UserData = useSelector((s: AppState) => s.data.userInfo);
  const whitelist: string[] = useSelector((s: AppState) => s.data.whitelist);

  const dispatch = useDispatch();

  const [editingFriends, setEditingFriends] = useState(false);

  const [editingAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    dispatch(fetchFriends());
  }, []);

  useEffect(() => {
    Animated.timing(editingAnim, {
      toValue: editingFriends ? 1 : 0,
      duration: 300
    }).start();
  }, [editingFriends]);

  let content = (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );

  const whitelistInterp = editingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, displayWidth * -1]
  });

  const editingInterp = editingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [displayWidth, 0]
  });

  if (userInfo && whitelist) {
    content = (
      <Fragment>
        <View
          style={{
            flexDirection: "row",
            padding: 20,
            justifyContent: "space-evenly",
            alignItems: "center"
          }}
        >
          <ProfileImage size={100} fbId={currentUser.providerData[0].uid} />
          <View
            style={{
              justifyContent: "space-around",
              alignItems: "center",
              paddingHorizontal: 10
            }}
          >
            <Text style={{ fontSize: 22 }}>{currentUser.displayName}</Text>
            <Button
              title="Log Out"
              onPress={() => {
                auth.signOut().then(dispatch(signOut()));
              }}
            />
            <Text>{Constants.manifest.version}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderTopColor: "black",
              borderTopWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 5
            }}
          >
            <Text style={{ fontSize: 20 }}>
              {editingFriends ? "Add Friends" : "Sharing With"}
            </Text>
            <TouchableOpacity onPress={() => setEditingFriends(e => !e)}>
              <AntDesign
                name={editingFriends ? "check" : "plus"}
                size={40}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <WhitelistSelector
              style={{
                position: "absolute",
                borderTopColor: "#ccc",
                borderTopWidth: 1,
                width: displayWidth,
                height: "100%",
                transform: [{ translateX: whitelistInterp }]
              }}
            />
            <FriendSelector
              style={{
                borderTopColor: "#ccc",
                position: "absolute",
                borderTopWidth: 1,
                width: displayWidth,
                height: "100%",
                transform: [{ translateX: editingInterp }]
              }}
            />
          </View>
        </View>
      </Fragment>
    );
  }

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <SafeAreaView style={styles.container}>{content}</SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#666",
    backgroundColor: "white"
  }
});
