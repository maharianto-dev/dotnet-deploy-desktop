import { configureStore } from "@reduxjs/toolkit";
import publishResultReducer from "./resultSlice";
import actionStateReducer from "./actionStateSlice";

export const globalStore = configureStore({
  reducer: {
    publishResult: publishResultReducer,
    actionState: actionStateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof globalStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof globalStore.dispatch;
