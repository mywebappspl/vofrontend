import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { URL } from "../const/api";
import { off, on } from "./circularProgress";
import { getSelectedCompany } from "./selectedCompany";
import { addSnackbar } from "./snackBar";

export const saveMember = createAsyncThunk(
  "member/saveMember",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    const { id, employee } = arg;
    try {
      await axiosInstance.post(URL + "company/" + id + "/employee/", employee);
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar("Employee created."));
      thunkApi.dispatch(getSelectedCompany(id));
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const statusMember = createAsyncThunk(
  "member/statusMember",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    try {
      const { id, state, companyId } = arg;
      await axiosInstance.patch(URL + "member/" + id, { active: state });
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar("Employee status changed."));
      thunkApi.dispatch(getSelectedCompany(companyId));
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
export const updateMember = createAsyncThunk(
  "member/updateMember",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    try {
      const { companyId, memberId, form } = arg;
      await axiosInstance.put(
        URL + "company/" + companyId + "/member/" + memberId,
        form
      );
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar("Employee updated."));
      thunkApi.dispatch(getSelectedCompany(companyId));
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
const membersSlice = createSlice({
  name: "members",
  initialState: {
    data: [],
    isSuccess: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(saveMember.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(saveMember.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(saveMember.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(statusMember.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(statusMember.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(statusMember.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(updateMember.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateMember.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(updateMember.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
  },
});
//export const { setCompanyActive, setCompanyInactive } = companiesSlice.actions
export default membersSlice;
