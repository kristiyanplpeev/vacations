import { combineReducers, createStore } from "redux";

import { userInfoReducer, userStatusReducer } from "./user/reducer";

const userReducers = combineReducers({
  userInfoReducer,
  userStatusReducer,
});

export const store = createStore(
  userReducers,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);
