import { configureStore } from "@reduxjs/toolkit";
import mentionReducer from "./slices/mentionSlice";
import dashboardReducer from "./slices/dashboardSlice";

const store = configureStore({
  reducer: {
    mentions: mentionReducer,
    dashboard: dashboardReducer,
  },
});

export default store;