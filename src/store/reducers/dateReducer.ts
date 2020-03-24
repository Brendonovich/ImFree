import {SIGN_OUT} from "constants/authActionTypes"

const initialState = {
  weeksAhead: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "INCREMENT_WEEK":
      return { ...state, weeksAhead: state.weeksAhead + 1 };
    case "DECREMENT_WEEK":
      return { ...state, weeksAhead: state.weeksAhead - 1 };
    case "SET_WEEK":
      return { ...state, weeksAhead: action.weeksAhead };
    case SIGN_OUT:
      return {...initialState}
    default:
      return state;
  }
};
