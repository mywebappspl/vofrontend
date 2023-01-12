import React from "react";
import { createRoot } from "react-dom/client";
import { store } from "./store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import circularProgress, { on, off } from "./state/circularProgress";
import { addSnackbar } from "./state/snackBar";
import { Provider } from "react-redux";
const container = document.getElementById("root");

const root = createRoot(container);

window.addCircular = () => store.dispatch(on());
window.removeCircular = () => store.dispatch(off());
window.snack = () => store.dispatch(addSnackbar("asadsadsd"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
