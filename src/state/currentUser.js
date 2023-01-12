import { createSlice } from "@reduxjs/toolkit";

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    userInfo: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});
export default currentUserSlice.reducer;
export const { setUser } = currentUserSlice.actions;
//export const selectCircularState = (state) => state.circular.circularValue
