import { combineReducers } from "redux";
import post from "./post";
import auth from "./auth";
import bookmark from "./bookmark";

const rootReducer = combineReducers({
  post,
  auth,
  bookmark,
});

export default rootReducer;
