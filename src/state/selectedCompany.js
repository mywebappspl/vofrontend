import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { URL } from "../const/api";
import { off, on } from "./circularProgress";
import { addSnackbar } from "./snackBar";
export const getSelectedCompany = createAsyncThunk(
  "company/getSelectedCompanyData",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    try {
      const { data } = await axiosInstance.get(
        URL + "company/" + arg + "?activemembers=false"
      );
      thunkApi.dispatch(off());

      return data;
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
const selectedCompanySlice = createSlice({
  name: "company",
  initialState: {
    data: [],
    isSuccess: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSelectedCompany.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(getSelectedCompany.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.isSuccess = true;
    });
    builder.addCase(getSelectedCompany.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
  },
});
export default selectedCompanySlice;
