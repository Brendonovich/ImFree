import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

type TimeData = {
  [uid: string]: TimeDataEntry;
};

type TimeDataEntry = {
  [date: string]: string;
};

type UserData = {
  [uid: string]: UserDataEntry;
};

type UserDataEntry = {
  displayName: string;
  fbId: string;
};

export const getWhitelistedTimes = functions.https.onCall(
  async (_, context) => {
    if (!context.auth)
      throw new functions.https.HttpsError(
        "unauthenticated",
        "getWhitelistedTimes requires a logged in user to execute"
      );

    let timeData: TimeData = {};
    const timeDataResults = await db
      .collection("privateData")
      .where("whitelist", "array-contains", context.auth.token.firebase.identities['facebook.com'][0])
      .get();

    timeDataResults.docs.forEach(
      doc => (timeData[doc.id] = doc.data().times as TimeDataEntry)
    );

    const userData: UserData = {};
    const userDataResults = await Promise.all(
      Object.keys(timeData).map(uid =>
        db
          .collection("userData")
          .doc(uid)
          .get()
      )
    );

    userDataResults.forEach(
      doc => (userData[doc.id] = doc.data() as UserDataEntry)
    );
    
    console.log(timeData)

    return Promise.resolve([timeData, userData]);
  }
);

export const addFacebookIDClaim = functions.https.onCall(
  async (_, context) => {
    if (!context.auth)
      throw new functions.https.HttpsError(
        "unauthenticated",
        "addFacebookIDClaim requires a logged in user to execute"
      );

    await admin.auth().setCustomUserClaims(context.auth.uid, { fbId: context.auth.token.firebase.identities['facebook.com'][0] });
  }
);
