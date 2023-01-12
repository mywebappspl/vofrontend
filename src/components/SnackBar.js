import React from "react";
import { Snackbar, SnackbarContent } from "@mui/material";
import { selectSnackBarState } from "../state/snackBar";
import { useSelector } from "react-redux";

const Snackbars = () => {
  const snackBarSelector = useSelector(selectSnackBarState);

  return (
    <div>
      {snackBarSelector.map((el, index) => (
        <Snackbar
          key={el.key}
          style={{ position: "fixed", bottom: 30 + 70 * index }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={true}
        >
          <SnackbarContent
            style={{ backgroundColor: el.color }}
            message={el.text}
          />
        </Snackbar>
      ))}
    </div>
  );
};
export default Snackbars;
