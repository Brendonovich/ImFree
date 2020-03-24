import React, { useEffect, Fragment } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { fetchMainData } from "store/actions/dataActions";

import NavBar from "components/NavBar";
import DateDisplay from "components/DateDisplay";
import DayList from "components/DayList";

export default () => {
  const mainDataLoading: boolean = useSelector(
    (s: AppState) => s.data.mainDataLoading
  );
  const mainDataError: string | null = useSelector(
    (s: AppState) => s.data.mainDataError
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMainData());
  }, []);

  let content;

  if (mainDataLoading)
    content = <ActivityIndicator size="large" color="#000" />
  else if (mainDataError)
    content = (
      <Text style={{ textAlign: "center", marginHorizontal: 50, fontSize: 18 }}>
        Error Fetching Calendar Data{"\n"}
        Please Try Again {"\n"}
        {mainDataError.toString()}
      </Text>
    );
  else
    content = (
      <Fragment>
        <DateDisplay style={{ zIndex: 1 }} />
        <DayList />
      </Fragment>
    );

  return <View style={styles.container}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    backgroundColor: "white"
  }
});
