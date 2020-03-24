import React from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import ProfileImage from "./ProfileImage";

import { toLocalTimeString } from "utils";

export default ({ fbId, time }) => {
  const displayName = useSelector((s: AppState) => s.data.userInfo[fbId].displayName);
  return (
    <View
      style={{
        height: 80,
        paddingHorizontal: 5,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row"
      }}
    >
      <ProfileImage fbId={fbId} size={60} />
      <View style={{ paddingLeft: 10, flex: 1 }}>
        <Text style={{ fontSize: 20 }}>{displayName}</Text>
        <Text style={{ fontSize: 20 }}>{toLocalTimeString(time)}</Text>
      </View>
    </View>
  );
};
