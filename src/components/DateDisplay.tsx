import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Text, FlatList, Dimensions } from "react-native";
import XDate from "xdate";
import { useSelector, useDispatch } from "react-redux";

import { getMonday } from "utils";

const { width } = Dimensions.get("window");
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default ({style}) => {
  const weeksAhead = useSelector(store => store.date.weeksAhead);
  const dispatch = useDispatch();

  const [dayNums, setDayNums] = useState([]);

  const listRef = useRef(null);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 51,
    minimumViewTime: 0,
    waitForInteraction: false
  });
  const loadedStates = useRef({
    weeksAhead: false
  });

  const [newWeeksAhead, setNewWeeksAhead] = useState(0);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length !== 0) {
      const weeks = viewableItems[0].index;
      setNewWeeksAhead(weeks);
    }
  });

  useEffect(() => {
    dispatch({ type: "SET_WEEK", weeksAhead: newWeeksAhead });
  }, [newWeeksAhead]);

  useEffect(() => {
    const currentMonday = getMonday(new XDate());

    let tempDayNums = [];
    for (var week = 0; week <= 4; week++) {
      var weekNums = [];
      for (var i = 0; i < 7; i++) {
        weekNums.push(currentMonday.clone().addDays(i + 7 * week));
      }
      tempDayNums.push(weekNums);
    }
    setDayNums(tempDayNums);
  }, []);

  useEffect(() => {
    if (loadedStates.current.weeksAhead) {
      listRef.current.scrollToIndex({ index: weeksAhead });
    } else loadedStates.current.weeksAhead = true;
  }, [weeksAhead]);

  const renderDay = (date: XDate) => {
    let isCurrentDay =
      date.toString("yyyy-MM-dd") === new XDate().toString("yyyy-MM-dd");
    let isPreviousDay = date.diffDays(new XDate().toString("yyyy-MM-dd")) > 0;

    let textStyles: {}[] = [styles.evenText];
    let viewStyles: {}[] = [styles.day];

    if (isCurrentDay) {
      textStyles.push(styles.currentDayText);
      viewStyles.push(styles.currentDayView);
    } else if (isPreviousDay) {
      textStyles.push(styles.previousDayText);
    }

    return (
      <View style={viewStyles} key={date.toString("yyyy-MM-dd")}>
        <Text style={textStyles}>{date.getDate()}</Text>
      </View>
    );
  };

  const renderListItem = (item: XDate[]) => (
    <View style={styles.dayNums}>
      {item.map((date: XDate) => renderDay(date))}
    </View>
  );

  const DayNames = (
    <View style={styles.dayNames}>
      {dayNames.map((name, index) => (
        <Text style={styles.evenText} key={index}>
          {name}
        </Text>
      ))}
    </View>
  );

  const DayNumbers = (
    <FlatList
      ref={listRef}
      initialScrollIndex={0}
      viewabilityConfig={viewabilityConfig.current}
      renderItem={({ item }) => renderListItem(item)}
      data={dayNums}
      horizontal
      pagingEnabled={true}
      keyExtractor={(_, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={viewableItemsChanged.current}
    />
  );

  return (
    <View style={[styles.dateDisplay, style]}>
      {DayNames}
      {DayNumbers}
    </View>
  );
};

const styles = StyleSheet.create({
  dayNums: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: width - 20,
    height: 30
  },
  evenText: {
    width: 30,
    textAlign: "center"
  },
  day: {
    height: 30,
    justifyContent: "center"
  },
  dateDisplay: {
    borderBottomWidth: 1,
    borderColor: "#666",
    backgroundColor: "white",
    paddingHorizontal: 10,
    height: 70,
    shadowColor: "black",
    shadowOffset: {
    	width: 0,
    	height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  elevation: 3,
  },
  dayNames: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 5
  },
  currentDayText: {
    color: "#FFF"
  },
  currentDayView: {
    backgroundColor: "#00ADF4",
    borderRadius: 15
  },
  previousDayText: {
    color: "#AAA"
  }
});
