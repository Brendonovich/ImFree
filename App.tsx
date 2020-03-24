import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import rootReducer from "store/reducers";

import RootLayout from "layouts/RootLayout";
import { StatusBar } from "react-native";

const middleware = [thunk]
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));

export default () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content"/>
      <RootLayout />
    </Provider>
  );
};
