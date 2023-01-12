import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { URL } from "../const/api";
import { off, on } from "./circularProgress";
import { addSnackbar } from "./snackBar";
export const getLogsPage = createAsyncThunk(
  "log/getLogsPage",
  async (arg, thunkApi) => {
    const { page, itemsPerPage, startDate, endDate } = arg;
    let url = URL + "logs";
    if (startDate && endDate)
      url +=
        "?startDate=" +
        startDate +
        "&endDate=" +
        endDate +
        "?pageNumber=" +
        page +
        "&itemsPerPage=" +
        itemsPerPage;
    else url += "?pageNumber=" + page + "&itemsPerPage=" + itemsPerPage;
    thunkApi.dispatch(on());
    try {
      const { data } = await axiosInstance.get(url);
      thunkApi.dispatch(off());
      return data;
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
const logSlice = createSlice({
  name: "logs",
  initialState: {
    isSuccess: false,
    loading: false,
    totalages: 0,
    currentPage: 0,
    data: {},
  },
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getLogsPage.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(getLogsPage.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload;
    });
    builder.addCase(getLogsPage.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
  },
});
export default logSlice;
