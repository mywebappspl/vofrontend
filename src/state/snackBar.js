import { createSlice } from "@reduxjs/toolkit";

export const addSnackbar =
  (text, color = "green", time = 3000) =>
  (dispatch, getState) => {
    const key = Date.now();
    const rightColor = color[color] || color;
    dispatch(on({ text, rightColor, key }));
    setTimeout(() => dispatch(off({ key })), time);
  };

const SnackBarSlice = createSlice({
  name: "snackBar",
  initialState: {
    bars: [],
  },
  reducers: {
    on: (state, action) => {
      state.bars.push({
        text: action.payload.text,
        color: action.payload.rightColor,
        key: action.payload.key,
      });
    },
    off: (state, action) => {
      state.bars = state.bars.filter((el) => el.key !== action.payload.key);
    },
  },
});
export default SnackBarSlice.reducer;
export const { on, off } = SnackBarSlice.actions;
export const selectSnackBarState = (state) => state.sBar.bars;
