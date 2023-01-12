import { createSlice } from "@reduxjs/toolkit";

const circularProgressSlice = createSlice({
  name: "circularProgress",
  initialState: {
    circularValue: [],
  },
  reducers: {
    on: (state) => {
      state.circularValue.push(true);
    },
    off: (state) => {
      state.circularValue = state.circularValue.filter(
        (el, index) => index !== 0
      );
    },
  },
});
export default circularProgressSlice.reducer;
export const { on, off } = circularProgressSlice.actions;
export const selectCircularState = (state) => state.circular.circularValue;
