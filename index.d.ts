type AppState ={
  data: DataState;
  auth: AuthState;
  date: any
}

type DataState = {
  timeData: TimeData;
  userInfo: UserData;
  personalTimes: TimeEntries;
  
  whitelistDataLoading: boolean;
  whitelistDataError?: string;

  whitelist: string[];
  whitelistLoading: boolean;
  whitelistError?: string;
  
  friends: string[];
  friendsLoading: boolean;
  friendsError?: string;
  
  mainDataLoading: boolean;
  mainDataError?: string;
  
  editTimeLoading: boolean;
  editTimeError?: string;
  
  [key: string]: any;
};

type AuthState = {
  user?: firebase.User;
  fbId: string;
  setupLoading: boolean;
  error?: string;
  authLoading: boolean;
}

type WhitelistedTimeData = {
  [uid: string]: TimeDataEntry
};

type TimeData = {
  date: string;
  times: TimeDataEntry
}[]

type TimeDataEntry = {
  [date: string]: string;
};

type PersonalData = {
  times: TimeEntries
  whitelist: string[]
}

type TimeEntries = {
  [date: string]: string;
}

type UserData = {
  [fbId: string]: {
    displayName: string
  };
};

type FriendData = UserData;