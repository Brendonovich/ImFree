Firestore Database Structure:
```typescript
database: {
    userData: {
        [uid: string]: {
            displayName: string
            fbId: string
        }
    }
    privateData: {
        [uid: string]: {
            times: {
                [date: string]: string
            }
            whitelist: string[]
        }
    }
}
```

Redux Store Structure:
```typescript
state: {
    auth: {
        user?: firebase.User
        fbId: string
        loading: boolean
        error?: string
    }
    data: {
        timeData: {
            date: string
            times: {
                [date: string]: string
            }
        }[]
        userInfo: {
            [uid: string]: string
        }
        personalTimes: {
            [date: string]: string
        }
        
        whitelist: string[]
        whitelistLoading: boolean
        whitelistError?: string
        
        friends: string[]
        friendsLoading: boolean
        friendsError?: string
  
        mainDataLoading: boolean
        mainDataError?: string

        editTimeLoading: boolean
        editTimeError?: string
    }
    date: {
        weeksAhead: number
    }
}
```