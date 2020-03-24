import { emptyDayArray } from "utils/constants";
import XDate from "xdate";


export const sortTimeData = (timeData: WhitelistedTimeData) => {
  var times: TimeData = emptyDayArray;

  let today = new XDate(new XDate(true).toString("yyyy-MM-dd"), true);
  for (const [uid, userTimes] of Object.entries(timeData)) {
    for (const [dateString, timeString] of Object.entries(userTimes)) {
      let date = new XDate(dateString, true);

      const dateIndex = Math.floor(today.diffDays(date));

      if (dateIndex >= 0) times[dateIndex].times[uid] = timeString;
    }
  }
  
  return times
}