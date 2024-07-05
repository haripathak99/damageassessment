import persist from "../persist";
import { createSlice } from "@reduxjs/toolkit";
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";

export interface dataState {
  data: any | null;
  loading: boolean;
  error: any | null;
}

const initialState: dataState = {
  data: null,
  loading: false,
  error: null,
};

const dataRequest: CaseReducer<dataState, PayloadAction<Partial<dataState>>> = (
  state
) => ({
  ...state,
  loading: true,
  error: null,
});
const dataSuccess: CaseReducer<dataState, PayloadAction<Partial<dataState>>> = (
  state,
  action
) => ({
  ...state,
  loading: false,
  error: null,
  data: action.payload,
});
const dataError: CaseReducer<dataState, PayloadAction<Partial<dataState>>> = (
  state
) => ({
  ...state,
  loading: false,
  error: "City Not found",
  data: null,
});

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    dataRequest,
    dataSuccess,
    dataError,
  },
});

export const selectdataData = (state: any) => state?.data?.data;
export const selectLoading = (state: any) => state?.data?.loading;
export const selectError = (state: any) => state?.data?.error;

export { dataSlice };
export default persist("data", [], dataSlice.reducer);
