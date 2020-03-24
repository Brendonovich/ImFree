import * as Facebook from "expo-facebook";
import firebase from "firebase";
import { AsyncStorage } from "react-native";

import { firestore, auth } from "utils/firebase";
import { fbAppID } from "config";
import {addFacebookIDClaim} from "api"
import * as actionTypes from "constants/authActionTypes";

export const setUser = (user: firebase.User) => ({
  type: actionTypes.SET_USER,
  payload: user
});
export const signOut = () => ({ type: actionTypes.SIGN_OUT });

const createUser = async (user: firebase.User) =>{
  let fbId = user.providerData[0].uid;
  await addFacebookIDClaim()
  await auth.currentUser.getIdToken(true)
  await Promise.all([
    firestore
      .collection("userData")
      .doc(fbId)
      .set({
        displayName: user.displayName
      }),
    firestore
      .collection("privateData")
      .doc(fbId)
      .set({ times: {}, whitelist: [] })
  ]);
}

const updateUser = async (user: firebase.User) =>
  await firestore
    .collection("userData")
    .doc(user.providerData[0].uid)
    .update({
      displayName: user.displayName
    });

const loginRequest = () => ({ type: actionTypes.LOGIN_REQUEST });
const loginSuccess = (user: firebase.User) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload: {user, fbId: user.providerData[0].uid}
});
const loginError = (error: string) => ({
  type: actionTypes.LOGIN_ERROR,
  payload: error
});


export const login = () => async dispatch => {
  dispatch(loginRequest());

  try {
    await Facebook.initializeAsync(fbAppID, "ImFree");

    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile", "user_friends"]
    });

    if (type === "cancel") return dispatch(loginError("Login Cancelled"));

    await AsyncStorage.setItem("authToken", token);

    var credential = firebase.auth.FacebookAuthProvider.credential(token);

    let {
      user,
      additionalUserInfo
    } = await firebase.auth().signInWithCredential(credential);

    
    if (additionalUserInfo.isNewUser) await createUser(user);
    else await updateUser(user)

    dispatch(loginSuccess(user));
  } catch (error) {
    dispatch(loginError(error));
  }
};
