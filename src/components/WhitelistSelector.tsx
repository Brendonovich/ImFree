import React from "react";
import {
  Animated,
  FlatList,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import ProfileImage from "components/ProfileImage";

import { whitelistRemoveUser } from "store/actions/dataActions";

const displayWidth = Dimensions.get("window").width;

export default ({ style }) => {
  const whitelist: string[] = useSelector((s: AppState) => s.data.whitelist);
  const loading: boolean = useSelector((s: AppState) => s.data.whitelistDataLoading || s.data.mainDataLoading);
  const error: string = useSelector((s: AppState) => s.data.whitelistDataError + s.data.whitelistError);
  const userInfo: UserData = useSelector((s: AppState) => s.data.userInfo);

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
        <ProfileImage fbId={fbId} size={60} />
        <Text style={{ fontSize: 20, paddingHorizontal: 10 }}>
          {userInfo[fbId].displayName}
        </Text>
      </View>
      <TouchableOpacity onPress={() => dispatch(whitelistRemoveUser(fbId))}>
        <AntDesign name="close" size={50} color="black" />
      </TouchableOpacity>
    </View>
  );

  let content: any;

  if (loading)
    content = (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  else if (error)
    content = (
      <Text style={{ textAlign: "center", marginHorizontal: 50, fontSize: 18 }}>
        Error Fetching Whitelist {"\n"}
        Please Try Again {"\n"}
        {error.toString()}
      </Text>
    );
  else
    content =
      whitelist.length !== 0 ? (
        <FlatList
          renderItem={({ item }) => renderItem(item)}
          data={whitelist}
          keyExtractor={(uid: string) => uid}
        />
      ) : (
        <Text style={{ position: "absolute", top: 20, fontSize: 18 }}>
          Not Sharing with Anyone!
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
