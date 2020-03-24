import {combineReducers} from "redux"

import authReducer from "./authReducer"
import dataReducer from "./dataReducer"
import dateReducer from "./dateReducer"

export default combineReducers({
    auth: authReducer,
    data: dataReducer,
    date: dateReducer
})