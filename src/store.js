import { configureStore } from "@reduxjs/toolkit";
import circularProgress from "./state/circularProgress";
import snackBar from "./state/snackBar";
import companies from "./state/companies";
import selectedCompany from "./state/selectedCompany";
import messageSlice from "./state/messages";
import membersSlice from "./state/members";
import logSlice from "./state/logs";
import queueSlice from "./state/queue";
import agentsSlice from "./state/agents";
import currentUserSlice from "./state/currentUser";
export const store = configureStore({
  reducer: {
    circular: circularProgress,
    sBar: snackBar,
    companies: companies.reducer,
    selectedCompany: selectedCompany.reducer,
    message: messageSlice.reducer,
    logs: logSlice.reducer,
    queue: queueSlice.reducer,
    members: membersSlice.reducer,
    agents: agentsSlice.reducer,
    userInfo: currentUserSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
