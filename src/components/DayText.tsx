import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";

const { width } = Dimensions.get("window");

interface IDayProps {
  day: XDate;
}

export default (props: IDayProps) => {
  const dayText = (
    <View style={styles.dayView}>
      <Text style={styles.dateText}>{props.day.getDate()}</Text>
      <Text>{props.day.toString("ddd")}</Text>
    </View>
  );

  return <View style={styles.event}>{dayText}</View>;
};

const styles = StyleSheet.create({
  event: {
    width,
    height: 80,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#eee"
  },
  dayView: {
    height: 80,
    width: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  dateText: {
    fontSize: 30
  }
});
