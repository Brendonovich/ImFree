import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default props => {
  let textStyles = [];
  textStyles.push(styles.weekButtonText);
  if (props.disabled) textStyles.push(styles.disabled);

  return (
    <TouchableOpacity
      onPress={() => props.onPressed()}
      activeOpacity={0.4}
      style={styles.weekButton}
      disabled={props.disabled}
    >
      <Text style={textStyles}>{props.text ? props.text : props.children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  weekButton: {
    // backgroundColor: "#00ADF4"
    width: 34,
    height: 34,
    borderRadius: 13,
    marginHorizontal: 5
  },
  weekButtonText: {
    // backgroundColor: "grey",
    fontSize: 28,
    textAlign: "center",
    color: "#00A0F0"
  },
  disabled: {
    display: "none"
  }
});
