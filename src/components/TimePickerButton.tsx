import React from "react";
import { View, Text, TouchableOpacity} from "react-native";

export default ({ time,  onPress, selected, text}) => {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 2
      }}
    >
      <Text style={{ fontSize: 22 }}>{text}: </Text>
      <TouchableOpacity
        onPress={onPress}
      >
        <View
          style={{
            borderWidth: 1,
            borderRadius: 4,
            borderColor: selected ? "blue" : "grey",
            paddingHorizontal: 4,
            paddingVertical: 1
          }}
        >
          <Text style={{ fontSize: 22 }}>{time.toString("hh:mm TT")}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
