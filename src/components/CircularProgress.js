import React from "react";
import { CircularProgress } from "@mui/material";

import { selectCircularState } from "../state/circularProgress";
import { useSelector } from "react-redux";

const styles = {
  div: {
    position: "fixed",
    left: 0,
    top: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(36,41,41,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 900000,
  },
  circular: { color: "#ffff33" },
};

const FullScreenCircularProgress = () => {
  const circularProgress = useSelector(selectCircularState);

  return circularProgress.length > 0 ? (
    <div style={styles.div}>
      <CircularProgress style={styles.circular} size={100} />
    </div>
  ) : null;
};

export default FullScreenCircularProgress;
