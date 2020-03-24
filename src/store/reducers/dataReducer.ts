import * as actionTypes from "constants/dataActionTypes";
import {SIGN_OUT} from "constants/authActionTypes"

const initialState: DataState = {
  timeData: null,
  userInfo: null,
  personalTimes: null,
  
  whitelistDataLoading: true,
  whitelistDataError: null,
  
  whitelist: null,
  whitelistLoading: true,
  whitelistError: null,
  
  friends: null,
  friendsLoading: true,
  friendsError: null,
  
  mainDataLoading: true,
  mainDataError: null,
  
  editTimeLoading: false,
  editTimeError: null,
  
  timeModalVisible: false
};

export default (state = initialState, action): DataState => {
  switch (action.type) {
    // Fetching data on launch
    case actionTypes.MAIN_DATA_REQUEST:
      return {
        ...state,
        mainDataLoading: true
      };
    case actionTypes.MAIN_DATA_SUCCESS:
      return {
        ...state,
        ...action.payload,
        userInfo: {...state.userInfo, ...action.payload.userInfo},
        mainDataLoading: false,
        mainDataError: null
      };
    case actionTypes.MAIN_DATA_ERROR:
      return {
        ...state,
        mainDataError: action.payload,
        mainDataLoading: false
      };
    case actionTypes.SET_PERSONAL_INFO:
      return {
        ...state,
        userInfo: {...state.userInfo, ...action.payload}
      }
      
    // Editing free times
    case "SET_TIME_MODAL_VISIBLE":
      return {
        ...state,
        timeModalVisible: action.payload
      }
    case actionTypes.EDIT_TIME_REQUEST:
      return {
        ...state,
        editTimeLoading: true
      }
    case actionTypes.UPDATE_TIME_SUCCESS:
      return {
        ...state,
        timeModalVisible: false,
        personalTimes: { ...state.personalTimes, ...action.payload },
        editTimeError: null,
        editTimeLoading: false, 
      };
    case actionTypes.REMOVE_TIME_SUCCESS:
      var newPersonalTimes = { ...state.personalTimes };
      delete newPersonalTimes[action.payload];
      return {
        ...state,        
        timeModalVisible: false,
        personalTimes: newPersonalTimes,
        editTimeError: null,
        editTimeLoading: false,
      };
    case actionTypes.EDIT_TIME_ERROR:
      return {
        ...state,
        editTimeError: action.payload,
        editTimeLoading: false
      }
      
    case actionTypes.WHITELIST_DATA_REQUEST:
      return {
        ...state,
        whitelistDataLoading: true,
        whitelistDataError: null
      }
    case actionTypes.WHITELIST_DATA_SUCCESS:
      return {
        ...state,
        whitelistDataLoading: false,
        userInfo: {...state.userInfo, ...action.payload}
      }
    case actionTypes.WHITELIST_DATA_ERROR:
      return {
        ...state,
        whitelistDataLoading: false,
        whitelistDataError: action.payload
      }
      
    // Adding/Removing friends from whitelist
    case actionTypes.WHITELIST_REQUEST:
      return {
        ...state,
        whitelistLoading: true
      };
    case actionTypes.WHITELIST_ADD_SUCCESS:
      return {
        ...state,
        whitelist: [...state.whitelist, action.payload],
        friends: state.friends.filter(v => v !== action.payload),
        whitelistLoading: false,
        whitelistError: null
      };
    case actionTypes.WHITELIST_REMOVE_SUCCESS:
      return {
        ...state,
        whitelist: state.whitelist.filter(v => v !== action.payload),
        friends: [...state.friends, action.payload],
        whitelistLoading: false,
        whitelistError: null
      };
    case actionTypes.WHITELIST_ERROR:
      return {
        ...state,
        whitelistLoading: false,
        whitelistError: action.payload
      };
      
    // Fetching friends list
    case actionTypes.FRIENDS_REQUEST:
      return {
        ...state,
        friendsLoading: true
      };
    case actionTypes.FRIENDS_SUCCESS:
      return {
        ...state,
        friends: action.payload.friends,
        friendsLoading: false,
        friendsError: null,
        userInfo: { ...state.userInfo, ...action.payload.friendInfo }
      };
    case actionTypes.FRIENDS_ERROR:
      return {
        ...state,
        friendsLoading: false,
        friendsError: action.payload
      };
    case SIGN_OUT:
      return {...initialState}
    default:
      return state;
  }
};
