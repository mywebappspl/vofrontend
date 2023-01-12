import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { URL } from "../const/api";
import { off, on } from "./circularProgress";
import { addSnackbar } from "./snackBar";
export const saveMessage = createAsyncThunk(
  "message/saveMessage",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    try {
      await axiosInstance.post(URL + "message", arg);
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar("Message queued."));
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
export const getMessagesPage = createAsyncThunk(
  "message/getMessagesPage",
  async (arg, thunkApi) => {
    const { companyId, page, itemsPerPage, startDate, endDate } = arg;
    let url = URL + "company/" + companyId + "/messages";

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
export const getMessagesForCsv = createAsyncThunk(
  "message/getMessagesCsv",
  async (arg, thunkApi) => {
    const { companyId, startDate, endDate } = arg;
    let url = URL + "company/" + companyId + "/messages?export=true";

    if (startDate && endDate)
      url += "&startDate=" + startDate + "&endDate=" + endDate;

    thunkApi.dispatch(on());
    try {
      const { data } = await axiosInstance.get(url, { responseType: "blob" });

      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar("Export succesfull"));
      return data;
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
const messageSlice = createSlice({
  name: "messages",
  initialState: {
    isSuccess: false,
    loading: false,
    totalages: 0,
    currentPage: 0,
    data: {},
  },
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(saveMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(saveMessage.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(saveMessage.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(getMessagesPage.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(getMessagesPage.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload;
    });
    builder.addCase(getMessagesPage.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(getMessagesForCsv.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(getMessagesForCsv.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
      state.data = payload;
    });
    builder.addCase(getMessagesForCsv.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
  },
});
export default messageSlice;
