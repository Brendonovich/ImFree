import React, { useState, useEffect, useReducer } from "react";
import Modal from "react-native-modal";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  ActivityIndicator
} from "react-native";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import XDate from "xdate";

import { hhMM } from "utils";
import TimePickerButton from "./TimePickerButton";

const initialShowState = {
  from: false,
  to: false
};

const showReducer = (state, action) => {
  switch (action.type) {
    case "SHOW_FROM":
      return { ...state, from: true, to: false };
    case "SHOW_TO":
      return { ...state, from: false, to: true };
    case "HIDE":
      return { ...state, from: false, to: false };
  }
};

enum ShowTypes {
  FROM,
  TO,
  HIDE
}

export default ({ date, isVisible, onBackdropPress, onTimeSubmitted }) => {
  const personalTimes: TimeEntries = useSelector(
    (s: AppState) => s.data.personalTimes
  );
  const editTimeLoading: boolean = useSelector(
    (s: AppState) => s.data.editTimeLoading
  );
  const editTimeError: string | null = useSelector(
    (s: AppState) => s.data.editTimeError
  );

  const currentDayData = personalTimes[date.toString("yyyy-MM-dd")];

  const [fromTime, setFromTime] = useState(hhMM("12:00"));
  const [toTime, setToTime] = useState(hhMM("13:00"));
  const [showPicker, setShowPicker] = useState(ShowTypes.HIDE);

  useEffect(() => {
    if (currentDayData !== undefined) {
      let times = currentDayData.split("-");
      setFromTime(hhMM(times[0], true).setUTCMode(false));
      setToTime(hhMM(times[1], true).setUTCMode(false));
    } else {
      setFromTime(hhMM("12:00"));
      setToTime(hhMM("13:00"));
    }
  }, [currentDayData]);

  useEffect(() => {
    if (isVisible) setShowPicker(ShowTypes.HIDE);
  }, [isVisible]);

  const handleButtonPress = type => {
    switch (type) {
      case "remove":
        onTimeSubmitted(null);
        break;
      case "submit":
        onTimeSubmitted(
          fromTime.clone().toUTCString("HH:mm") +
            "-" +
            toTime.clone().toUTCString("HH:mm")
        );
        break;
      case "cancel":
        onBackdropPress();
        break;
    }
  };

  const timeChanged = time => {
    if (Platform.OS === "android") setShowPicker(ShowTypes.HIDE);

    if (showPicker === ShowTypes.FROM) setFromTime(new XDate(time));
    else setToTime(new XDate(time));
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => {
        onBackdropPress();
      }}
      style={{ alignItems: "center", justifyContent: "center" }}
      backdropOpacity={0.5}
      useNativeDriver={true}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 15,
          borderRadius: 20
        }}
      >
        <Text style={{ fontSize: 22 }}>
          I'm Free on {date.toString("ddd d MMM")}
        </Text>

        <View style={{ alignItems: "flex-end", paddingVertical: 10 }}>
          <TimePickerButton
            text={"From"}
            time={fromTime}
            selected={showPicker === ShowTypes.FROM}
            onPress={() => {
              if (showPicker === ShowTypes.FROM) setShowPicker(ShowTypes.HIDE);
              else setShowPicker(ShowTypes.FROM);
            }}
          />

          <TimePickerButton
            text={"To"}
            time={toTime}
            selected={showPicker === ShowTypes.TO}
            onPress={() => {
              if (showPicker === ShowTypes.TO) setShowPicker(ShowTypes.HIDE);
              else setShowPicker(ShowTypes.TO);
            }}
          />
        </View>

        {showPicker !== ShowTypes.HIDE && (
          <DateTimePicker
            value={
              showPicker === ShowTypes.FROM
                ? fromTime.toDate()
                : toTime.toDate()
            }
            display={"spinner"}
            mode={"time"}
            onChange={(_, d) => timeChanged(d)}
            style={{ width: "100%" }}
            maximumDate={
              showPicker === ShowTypes.FROM
                ? toTime
                    .clone()
                    .addMinutes(-1)
                    .toDate()
                : null
            }
            minimumDate={
              showPicker === ShowTypes.TO
                ? fromTime
                    .clone()
                    .addMinutes(1)
                    .toDate()
                : null
            }
          />
        )}

        <View style={{ flexDirection: "row" }}>
          {currentDayData && (
            <Button
              disabled={editTimeLoading}
              title="Remove"
              color="red"
              onPress={() => handleButtonPress("remove")}
            />
          )}
          <Button
            disabled={editTimeLoading}
            title="Confirm"
            onPress={() => handleButtonPress("submit")}
          />
          <Button
            disabled={editTimeLoading}
            title="Cancel"
            onPress={() => handleButtonPress("cancel")}
          />
        </View>

        {editTimeLoading && (
          <ActivityIndicator
            style={{
              position: "absolute",
              right: 20,
              bottom: 20,
              width: 25,
              height: 25
            }}
          />
        )}
        {editTimeError && (
          <Text style={{ color: "red" }}>
            An Error Occured. Please Try Again
          </Text>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  timeView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: 5
  }
});
