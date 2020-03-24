import * as actionTypes from "constants/authActionTypes"

const initialState : AuthState = {
  user: null,
  fbId: "",
  setupLoading: false,
  authLoading: true,
  error: null,
};

export default (state = initialState, action) : AuthState => {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        setupLoading: true
      }
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        setupLoading: false,
        authLoading: false,
        error: null
      };
    case actionTypes.LOGIN_ERROR:
      return {
        ...state,
       setupLoading: false,
       error: action.payload
      };
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        fbId: action.payload ? action.payload.providerData[0].uid : "",
        authLoading: false
      };
    case actionTypes.SIGN_OUT:
      return {...initialState};    
    default:
      return state;
  }
};
