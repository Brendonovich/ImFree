import React, { useEffect, useState } from "react";
import { Animated, Easing } from 'react-native'
import XDate from "xdate";

import { getMonday } from "utils";

export const useWeekText = weeksAhead => {
  const [weekText, setWeekText] = useState("");

  useEffect(() => {
    let startDate = getMonday(new XDate().addDays(7 * weeksAhead));
    let endDate = startDate.clone().addDays(6);

    let startMonth = startDate.toString("MMM");
    let endMonth = endDate.toString("MMM");

    let displayBothMonths = false;
    if (startMonth !== endMonth) displayBothMonths = true;

    var str = "";
    if (displayBothMonths)
      str =
        startDate.getDate() +
        " " +
        startMonth +
        " - " +
        endDate.getDate() +
        " " +
        endMonth;
    else str = startDate.getDate() + " - " + endDate.getDate() + " " + endMonth;

    setWeekText(str);
  }, [weeksAhead]);

  return weekText;
};

export const useSlideAnimation = (distance, indexOffset, shouldAnimate) => {
  const [loadAnim] = useState(new Animated.Value(shouldAnimate ? distance : 0));

  useEffect(() => {
    Animated.timing(loadAnim, {
      toValue: 0,
      duration: 500,
      delay: 100 * indexOffset,
      easing: Easing.out(Easing.cubic)
    }).start();
  }, []);
  
  return loadAnim
}