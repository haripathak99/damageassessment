import { call, put, takeLatest } from "redux-saga/effects";

import { dataRequest, dataSuccess, dataError } from "../../actions/project";
// import { dataState } from "../../slices/project";

export function* dataFetch(action: { type: any; payload: any }) {
  const { payload } = action;
  // const { data } = action.payload;
  console.log(payload, "error action");
  try {
    const dataCall = yield call(payload);
    console.log(dataCall, "where is data");
    yield put(dataSuccess(dataCall));
  } catch (error: any) {
    yield put(dataError(error));
  }
}

function* fetchDataWatcher() {
  yield takeLatest(dataRequest.type, dataFetch);
}

export default fetchDataWatcher;
