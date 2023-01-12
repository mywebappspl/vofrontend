import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance, { URL } from "../const/api";
import { off, on } from "./circularProgress";
import { addSnackbar } from "./snackBar";
export const getQueuePage = createAsyncThunk(
  "queue/getQueuePage",
  async (arg, thunkApi) => {
    console.log(arg);
    const { page, itemsPerPage, startDate, endDate } = arg;
    let url = URL + "message/queue";

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
const queueSlice = createSlice({
  name: "queue",
  initialState: {
    isSuccess: false,
    loading: false,
    totalages: 0,
    currentPage: 0,
    data: {},
  },
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getQueuePage.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(getQueuePage.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload;
    });
    builder.addCase(getQueuePage.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
  },
});
export default queueSlice;
