import firebase from "firebase";
import { AsyncStorage } from "react-native";

import { getWhitelistedTimes, getAllUserData } from "api";
import { sortTimeData } from "utils/api";
import { firestore, auth } from "utils/firebase";
import { docToData } from "utils";
import * as actionTypes from "constants/dataActionTypes";

export const fetchMainData = () => async dispatch => {
  let personalData: PersonalData;
  let userInfo: UserData;

  dispatch(mainDataRequest());

  try {
    const whitelistData = await getWhitelistedTimes();
    
    const uid = auth.currentUser.providerData[0].uid.toString()

    const personalDoc = await firestore
      .collection("privateData")
      .doc(uid)
      .get();

    personalData = personalDoc.data() as PersonalData;
    userInfo = whitelistData[1]

    dispatch(
      mainDataSuccess({
        timeData: sortTimeData(whitelistData[0]),
        userInfo,
        personalTimes: personalData.times,
        whitelist: personalData.whitelist
      })
    );
  } catch (error) {
    dispatch(mainDataError(error));
  }

  dispatch(whitelistDataRequest());

  try {
    const whitelistUsers: string[] = personalData.whitelist.filter(
      fbId => !Object.keys(userInfo).includes(fbId)
    );
    
    const whitelistData = docToData(
      ...(await Promise.all(
        whitelistUsers.map(fbId =>
          firestore
            .collection("userData")
            .doc(fbId)
            .get()
        )
      ))
    );

    let whitelistUserInfo = {};
    whitelistUsers.forEach(
      (fbId, index) => (whitelistUserInfo[fbId] = whitelistData[index])
    );

    dispatch(whitelistDataSuccess(whitelistUserInfo));
  } catch (error) {
    dispatch(whitelistDataError(error));
  }
};

export const updateTime = (day: string, time: string) => async dispatch => {
  dispatch(editTimeRequest());

  try {
    await firestore
      .collection("privateData")
      .doc(auth.currentUser.providerData[0].uid)
      .update({ [`times.${day}`]: time });
    dispatch(updateTimeSuccess({ [day]: time }));
  } catch (error) {
    dispatch(editTimeError(error));
  }
};

export const removeTime = (day: string) => async dispatch => {
  dispatch(editTimeRequest());

  try {
    await firestore
      .collection("privateData")
      .doc(auth.currentUser.providerData[0].uid)
      .update({ [`times.${day}`]: firebase.firestore.FieldValue.delete() });
    dispatch(removeTimeSuccess(day));
  } catch (error) {
    editTimeError(error);
  }
};

export const fetchFriends = () => async (dispatch, getState) => {
  dispatch(fetchFriendsRequest());

  const token = await AsyncStorage.getItem("authToken");

  try {
    const friendData = (
      await (
        await fetch(
          `https://graph.facebook.com/v6.0/me?fields=friends{id,name}&access_token=${token}`
        )
      ).json()
    ).friends.data;

    const whitelist = getState().data.whitelist;

    var friendInfo: UserData = {};
    friendData.forEach(friend => {
      let fbId = friend.id;
      if (!whitelist.includes(fbId))
        friendInfo[fbId] = { displayName: friend.name };
    });

    dispatch(
      fetchFriendsSuccess({ friends: Object.keys(friendInfo), friendInfo })
    );
  } catch (error) {
    dispatch(fetchFriendsError(error));
  }
};

export const whitelistAddUser = uid => async dispatch => {
  dispatch(whitelistRequest());

  try {
    await firestore
      .collection("privateData")
      .doc(auth.currentUser.providerData[0].uid)
      .update({
        whitelist: firebase.firestore.FieldValue.arrayUnion(uid)
      });
    dispatch(whitelistAddSuccess(uid));
  } catch (error) {
    dispatch(whitelistError(error));
  }
};

export const whitelistRemoveUser = uid => async dispatch => {
  dispatch(whitelistRequest());
  try {
    await firestore
      .collection("privateData")
      .doc(auth.currentUser.providerData[0].uid)
      .update({
        whitelist: firebase.firestore.FieldValue.arrayRemove(uid)
      });
    dispatch(whitelistRemoveSuccess(uid));
  } catch (error) {
    dispatch(whitelistError(error));
  }
};

export const setPersonalInfo = user => ({
  type: actionTypes.SET_PERSONAL_INFO,
  payload: { [user.providerData[0].uid]: { displayName: user.displayName } }
});

const mainDataRequest = () => ({
  type: actionTypes.MAIN_DATA_REQUEST
});
const mainDataSuccess = data => ({
  type: actionTypes.MAIN_DATA_SUCCESS,
  payload: data
});
const mainDataError = error => ({
  type: actionTypes.MAIN_DATA_ERROR,
  payload: error
});

const editTimeRequest = () => ({ type: actionTypes.EDIT_TIME_REQUEST });
const updateTimeSuccess = payload => ({
  type: actionTypes.UPDATE_TIME_SUCCESS,
  payload
});
const removeTimeSuccess = (payload: string) => ({
  type: actionTypes.REMOVE_TIME_SUCCESS,
  payload
});
const editTimeError = error => ({
  type: actionTypes.EDIT_TIME_ERROR,
  payload: error
});

const fetchFriendsRequest = () => ({ type: actionTypes.FRIENDS_REQUEST });
const fetchFriendsSuccess = payload => ({
  type: actionTypes.FRIENDS_SUCCESS,
  payload
});
const fetchFriendsError = error => ({
  type: actionTypes.FRIENDS_ERROR,
  payload: error
});

const whitelistDataRequest = () => ({
  type: actionTypes.WHITELIST_DATA_REQUEST
});
const whitelistDataSuccess = (payload: UserData) => ({
  type: actionTypes.WHITELIST_DATA_SUCCESS,
  payload
});
const whitelistDataError = (error: string) => ({
  type: actionTypes.WHITELIST_DATA_ERROR,
  payload: error
});

const whitelistRequest = () => ({ type: actionTypes.WHITELIST_REQUEST });
const whitelistAddSuccess = uid => ({
  type: actionTypes.WHITELIST_ADD_SUCCESS,
  payload: uid
});
const whitelistRemoveSuccess = uid => ({
  type: actionTypes.WHITELIST_REMOVE_SUCCESS,
  payload: uid
});
const whitelistError = error => ({
  type: actionTypes.WHITELIST_ERROR,
  payload: error
});
