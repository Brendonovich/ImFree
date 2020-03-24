import React, { useEffect, useState, useRef } from "react";
import { FlatList, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import XDate from "xdate";

import { updateTime, removeTime } from "store/actions/dataActions";
import { getMonday } from "utils";

import FreeModal from "./FreeModal";
import DayItem from "./DayItem";

export default () => {
  const weeksAhead: number = useSelector((s: AppState) => s.date.weeksAhead);
  const timeData: TimeData = useSelector((s: AppState) => s.data.timeData);
  const timeModalVisible: boolean = useSelector((s: AppState) => s.data.timeModalVisible)

  const dispatch = useDispatch();

  const listRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(
    new XDate().toString("yyyy-MM-dd")
  );
  const [timeModalData, setTimeModalData] = useState(new XDate());

  useEffect(() => {
    const remDays = Math.ceil(
      new XDate().diffDays(getMonday(new XDate().addDays(7)))
    );
    if (listRef.current) {
      if (weeksAhead == 0) listRef.current.scrollToIndex({ index: 0 });
      else
        listRef.current.scrollToIndex({
          index: remDays + (weeksAhead - 1) * 7
        });
    }
  }, [weeksAhead]);

  const renderListItem = (dayData, index) => {
    const day = new XDate(dayData.date, true).setUTCMode(false);
    return (
      <DayItem
        times={dayData.times}
        day={day}
        onEdit={() => {
          setTimeModalData(day);
          dispatch({type: "SET_TIME_MODAL_VISIBLE", payload: true})
        }}
        onSelected={() => setSelectedDate(day.toString("yyyy-MM-dd"))}
        index={index}
        selected={day.toString("yyyy-MM-dd") === selectedDate}
      />
    );
  };

  return (
    <View style={{ flex: 1}}>
      <FreeModal
        date={timeModalData}
        isVisible={timeModalVisible}
        onBackdropPress={() => dispatch({type: "SET_TIME_MODAL_VISIBLE", payload: false})}
        onTimeSubmitted={time => {
          if (time !== null)
            dispatch(updateTime(timeModalData.toString("yyyy-MM-dd"), time));
          else dispatch(removeTime(timeModalData.toString("yyyy-MM-dd")));
        }}
      />

      <FlatList
        ref={listRef}
        renderItem={({ item, index }) => renderListItem(item, index)}
        data={timeData}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
