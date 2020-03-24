import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import { useSelector } from "react-redux";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";

import ProfileImage from "./ProfileImage";
import UserTime from "./UserTime";

import { useSlideAnimation } from "hooks"

const displayHeight = Dimensions.get("window").height;

export default ({ day, times, onSelected, onEdit, index, selected }) => {
  const personalTimes : TimeEntries = useSelector((s: AppState) => s.data.personalTimes);
  const edit = Object.keys(personalTimes).includes(
    day.toString("yyyy-MM-dd")
  );
  
  const loadAnim = useSlideAnimation(displayHeight, index, index < 10);

  const usersArray = Object.keys(times);

  if (!selected)
    return (
      <Animated.View
        style={{
          height: 80,
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#666",
          alignItems: "center",
          transform: [
            {
              translateY: loadAnim
            }
          ]
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: 5
          }}
        >
          <View
            style={{
              height: 70,
              width: 60,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 40,
              marginRight: "auto"
            }}
          >
            <Text style={{ fontSize: 30 }}>{day.getDate()}</Text>
            <Text style={{ fontSize: 15 }}>{day.toString("ddd")}</Text>
          </View>

          <View style={{ flex: -1 }}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{ alignItems: "center" }}
              showsHorizontalScrollIndicator={false}
            >
              {usersArray.map((uid: string) => (
                <View key={uid} style={{ marginHorizontal: 5 }}>
                  <ProfileImage size={60} fbId={uid} />
                </View>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={{
              borderRadius: 30,
              marginHorizontal: 5,
              width: 60,
              height: 60
            }}
            onPress={onEdit}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {edit ? (
                <SimpleLineIcons name="pencil" size={45} color="black" />
              ) : (
                <AntDesign name="plus" size={60} color="black" />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSelected()}
            style={{
              marginHorizontal: 5,
              width: 40,
              aspectRatio: 1,
              borderRadius: 20
            }}
          >
            <View
              style={{
                flex: 1,
                paddingTop: 4,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <AntDesign name="down" size={30} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  else {
    let timesArray = Object.keys(times);
    let height = 50 + 80 * timesArray.length;
    if (timesArray.length == 0) height = 90;
    return (
      <Animated.View
        style={{
          displayHeight,
          flexDirection: "column",
          borderBottomWidth: 1,
          borderBottomColor: "#666",
          flex: 1,
          backgroundColor: "#f0f0f0",
          paddingHorizontal: 10,
          transform: [{ translateY: loadAnim }]
        }}
      >
        <View
          style={{
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 0,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1
          }}
        >
          <Text style={{ fontSize: 20 }}>{day.toString("dddd d")}</Text>
        </View>
        {timesArray.length !== 0 ? (
          <View>
            {timesArray.map((uid: string) => (
              <UserTime key={uid} fbId={uid} time={times[uid]} />
            ))}
          </View>
        ) : (
          <View
            style={{
              height: 40,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 15 }}>No One is Free!</Text>
          </View>
        )}
      </Animated.View>
    );
  }
};
