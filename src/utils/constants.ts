import XDate from "xdate"

export const DAY_FORMAT = "yyyy-MM-dd"

export const emptyDayArray: TimeData = [
  ...Array(35 - new XDate().getDay()).keys()
].map(i => ({
  date: new XDate().addDays(i).toString(DAY_FORMAT),
  times: {}
}));