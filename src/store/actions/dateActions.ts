export const incrementWeek = () => ({
  type: "INCREMENT_WEEK"
});

export const decrementWeek = () => ({
  type: "DECREMENT_WEEK"
});

export const setWeek = weeksAhead => ({
  type: "SET_WEEK",
  weeksAhead
});
