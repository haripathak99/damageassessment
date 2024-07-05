import {
  AnyAction,
  CombinedState,
  combineReducers,
  Reducer,
} from "@reduxjs/toolkit";
import common, { CommonState } from "../slices/common";
import loader, { LoaderState } from "../slices/loader";
import data, { dataState } from "../slices/project";

export interface IRootReducer {
  common: CommonState;
  loader: LoaderState;
  data: dataState;
}

const rootReducer: Reducer<
  CombinedState<IRootReducer>,
  AnyAction
> = combineReducers({
  common,
  loader,
  data,
});

export default rootReducer;
