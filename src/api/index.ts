import { functions, firestore } from "utils/firebase";

export const getWhitelistedTimes = async (): Promise<[
  WhitelistedTimeData,
  UserData
]> => (await functions.httpsCallable("getWhitelistedTimes")()).data;

export const addFacebookIDClaim = async () => await functions.httpsCallable("addFacebookIDClaim")()

export const getAllUserData = async (uid: string) =>
  await Promise.all([
    firestore
      .collection("privateData")
      .doc(uid)
      .get(),
    firestore
      .collection("userData")
      .doc(uid)
      .get()
  ]);
