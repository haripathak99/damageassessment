import { all, fork } from "redux-saga/effects";
import fetchDataWatcher from "./project";

export default function* rootSaga() {
  yield all([fork(fetchDataWatcher)]);
}
