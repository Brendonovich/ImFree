import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { getMonday } from "utils";
import { useWeekText } from "hooks";

import NavButton from "./NavButton";
import DayDisplay from "./DateDisplay";
import XDate from "xdate";

export default props => {
  const dispatch = useDispatch();

  const weeksAhead = useSelector((s: AppState) => s.date.weeksAhead);

  return (
    <View style={styles.navBar}>
      <NavButton
        onPressed={() => dispatch({ type: "DECREMENT_WEEK" })}
        text="<"
        disabled={weeksAhead === 0}
      />
      <Text style={{ fontSize: 18 }}>Calendar</Text>
      <NavButton
        onPressed={() => dispatch({ type: "INCREMENT_WEEK" })}
        text=">"
        disabled={weeksAhead === 4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});
