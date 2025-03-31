"use client";

import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./project-slice";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const store = configureStore({
  reducer: {
    project: projectReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
