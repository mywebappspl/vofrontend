import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { URL } from "../const/api";
import { off, on } from "./circularProgress";
import { addSnackbar } from "./snackBar";
export const getAllAgents = createAsyncThunk(
  "agent/getAllAgentsData",
  async (arg, thunkApi) => {
    try {
      thunkApi.dispatch(on());
      const { data } = await axiosInstance.get(URL + "agents");
      thunkApi.dispatch(off());
      return data;
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
export const saveAgent = createAsyncThunk(
  "agent/saveAgent",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    const { agent } = arg;
    try {
      await axiosInstance.post(URL + "agents", agent);
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar("Agent created."));
      thunkApi.dispatch(getAllAgents());
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const statusAgent = createAsyncThunk(
  "agent/statusAgent",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    try {
      const { id, state } = arg;
      await axiosInstance.put(URL + "agents/" + id + "/status", {
        enabled: state,
      });
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar("Agent status changed."));
      thunkApi.dispatch(getAllAgents());
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
export const getAgentRole = createAsyncThunk(
  "agent/getAgentRole",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    try {
      const { data } = await axiosInstance.get(
        URL + "agents/" + arg + "/admin"
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
export const passwordAgent = createAsyncThunk(
  "agent/passwordAgent",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    try {
      const { memberId, password } = arg;
      await axiosInstance.put(
        URL + "agents/" + memberId + "/password",
        password
      );
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar("Agent's password changed."));
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
export const setAgentRole = createAsyncThunk(
  "agent/setAgentRole",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    try {
      const { memberId, state } = arg;
      await axiosInstance.put(URL + "agents/" + memberId + "/admin", {
        state: state,
      });
      thunkApi.dispatch(off());
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
export const updateAgent = createAsyncThunk(
  "agent/updateAgent",
  async (arg, thunkApi) => {
    thunkApi.dispatch(on());
    try {
      const { memberId, form } = arg;
      await axiosInstance.put(URL + "agents/" + memberId, form);
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar("Agent updated."));
      thunkApi.dispatch(getAllAgents());
    } catch (error) {
      thunkApi.dispatch(off());
      thunkApi.dispatch(addSnackbar(error.message, "red"));
      thunkApi.rejectWithValue(error.response.data);
    }
  }
);
const agentsSlice = createSlice({
  name: "agents",
  initialState: {
    data: [],
    isSuccess: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllAgents.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(getAllAgents.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.isSuccess = true;
    });
    builder.addCase(getAllAgents.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(saveAgent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(saveAgent.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(saveAgent.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(statusAgent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(statusAgent.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(statusAgent.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(setAgentRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(setAgentRole.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(setAgentRole.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(getAgentRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAgentRole.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(getAgentRole.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(passwordAgent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(passwordAgent.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(passwordAgent.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
    builder.addCase(updateAgent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateAgent.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
    });
    builder.addCase(updateAgent.rejected, (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    });
  },
});
export const { setCompanyActive, setCompanyInactive } = agentsSlice.actions;
export default agentsSlice;
