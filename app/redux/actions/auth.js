import * as api from "../api";
import {
  AUTH,
  FETCH_USER_ID,
  FETCH_USER,
  UPDATE_USER,
} from "../constants/actionType";

export const signin = (newUser) => async (dispatch) => {
  try {
    const { data } = await api.signIn(newUser);
    dispatch({ type: AUTH, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const signUp = (newUser) => async (dispatch) => {
  try {
    const { data } = await api.signUp(newUser);
    dispatch({ type: AUTH, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = () => async (dispatch) => {
  try {
    const { data } = await api.getUsers();
    console.log(data , " This is action User Data")
    dispatch({ type: FETCH_USER, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getUserByID = (id) => async (dispatch) => {
  try {
    const { data } = await api.getUserById(id);
    dispatch({ type: FETCH_USER_ID, payload: data });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = (id, updatedUser) => async (dispatch) => {
  try {
    const { data } = await api.updateUser(id, updatedUser);
    dispatch({ type: UPDATE_USER, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const mergeAndUpdateLocalUserData = (updatedFields) => {
  try {
    // Get existing user data from localStorage
    const existingUser = JSON.parse(localStorage.getItem("profile")) || {};

    // Merge only into the `result` field
    const updatedUser = {
      ...existingUser,
      result: {
        ...existingUser.result,
        ...updatedFields,
      },
    };

    // Save back to localStorage
    localStorage.setItem("profile", JSON.stringify(updatedUser));

    return updatedUser;
  } catch (error) {
    console.error("Error updating local user data:", error);
  }
};

export const getFollowersByIds = async (userIds, dispatch) => {
  try {
    const userPromises = userIds.map((id) => dispatch(getUserByID(id)));
    const usersData = await Promise.all(userPromises);
    console.log(userIds, "This is fetched UserData");
    return usersData; // ✅ contains actual user data
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getFollowingByIds = async (userIds, dispatch) => {
  try {
    const userPromises = userIds.map((id) => dispatch(getUserByID(id)));
    const usersData = await Promise.all(userPromises);
    return usersData;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
