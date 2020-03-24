import React from "react";
import {
  Animated,
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import { whitelistAddUser } from "store/actions/dataActions";
import { userPictureURL } from "utils";

const displayWidth = Dimensions.get("window").width;

export default ({ style }) => {
  const userInfo: UserData = useSelector((s: AppState) => s.data.userInfo);
  const friends: string[] = useSelector((s: AppState) => s.data.friends);
  const friendsLoading: boolean = useSelector(
    (s: AppState) => s.data.friendsLoading
  );
  const friendsError: string | null = useSelector(
    (s: AppState) => s.data.friendsError
  );

  const dispatch = useDispatch();

  const renderItem = (fbId: string) => (
    <View
      style={{
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        width: displayWidth
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: userPictureURL(fbId) }}
          style={{ width: 60, height: 60, borderRadius: 30 }}
        />
        <Text style={{ fontSize: 20, paddingHorizontal: 10 }}>
          {userInfo[fbId].displayName}
        </Text>
      </View>
      <TouchableOpacity onPress={() => dispatch(whitelistAddUser(fbId))}>
        <AntDesign name="plus" size={50} color="black" />
      </TouchableOpacity>
    </View>
  );

  let content: any;

  if (friendsLoading)
    content = (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  else if (friendsError)
    content = (
      <Text style={{ textAlign: "center", marginHorizontal: 50, fontSize: 18 }}>
        Error Fetching Friends {"\n"}
        Please Try Again {"\n"}
        {friendsError.toString()}
      </Text>
    );
  else
    content =
      friends.length !== 0 ? (
        <FlatList
          data={friends}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(uid: string) => uid}
        />
      ) : (
        <Text style={{ position: "absolute", top: 20, fontSize: 18 }}>
          No More Friends to Share With!
        </Text>
      );

  return (
    <Animated.View
      style={[style, { alignItems: "center", justifyContent: "center" }]}
    >
      {content}
    </Animated.View>
  );
};
