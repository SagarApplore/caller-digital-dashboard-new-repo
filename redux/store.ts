import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import agentsReducer from "@/redux/slices/agents";

export const store = configureStore({
  reducer: {
    counter: agentsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
