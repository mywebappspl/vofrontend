import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { URL } from "../const/api";
import { off, on } from "./circularProgress";
import { addSnackbar } from "./snackBar";
export const getAllCompanies = createAsyncThunk(
  "company/getAllCompaniesData",
  async (arg, thunkApi) => {
    try {
      thunkApi.dispatch(on());
      const { data } = await axiosInstance.get(URL + "company?extended=true");
      thunkApi.dispatch(off());
      return data;
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
export const saveCompany = createAsyncThunk(
  "company/saveCompany",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    try {
      await axiosInstance.post(URL + "company", arg);
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar("Company created."));
      thunkApi.dispatch(getAllCompanies());
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const statusCompany = createAsyncThunk(
  "company/statusCompany",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    try {
      const { id, state } = arg;
      await axiosInstance.patch(URL + "company/" + id, { active: state });
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar("Company status changed."));
      thunkApi.dispatch(getAllCompanies());
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    try {
      const { id, form } = arg;
      await axiosInstance.put(URL + "company/" + id, form);
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar("Company updated."));
      thunkApi.dispatch(getAllCompanies());
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
const companiesSlice = createSlice({
  name: "companies",
  initialState: {
    data: [],
    isSuccess: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCompanies.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(getAllCompanies.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.isSuccess = true;
    });
    builder.addCase(getAllCompanies.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(saveCompany.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(saveCompany.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(saveCompany.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(statusCompany.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(statusCompany.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(statusCompany.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(updateCompany.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCompany.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(updateCompany.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
  },
});
export const { setCompanyActive, setCompanyInactive } = companiesSlice.actions;
export default companiesSlice;
