import React from "react";
import { View, Image, StyleSheet, ViewStyle, ImageStyle } from "react-native";
import { useSelector } from "react-redux";
import {userPictureURL} from "utils"

export default ({ fbId, size }) => (
    <Image
      style={{borderRadius: size / 2, width: size, height: size}}
      source={{ uri: userPictureURL(fbId) }}
    />
  );