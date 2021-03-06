import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";

import { AppActions } from "store/user/types";

import { userInfoReducer } from "./user/reducer";

export const userReducers = combineReducers({
  userInfoReducer,
});

export type AppState = ReturnType<typeof userReducers>;

export const store = createStore(userReducers, applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>));
