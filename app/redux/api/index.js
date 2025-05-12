import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8200/api/v1",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

// Posts
export const fetchPost = () => API.get("/post");
export const fetchPostByID = (id) => API.get(`/post/${id}`);
export const createPost = (newPost) => API.post("/post", newPost);
export const deletePost = (id) => API.delete(`/post/${id}`);
export const updatePost = (id, updatedPost) =>
  API.put(`/post/${id}`, updatedPost);


// BookMark
export const fetchBookMark = () => API.get("/bookmark");
export const fetchBookMarkByID = (id) => API.get(`/bookmark/${id}`);
export const createBookMark = (newBookMark) => API.post("/bookmark", newBookMark);
export const deleteBookMark = (id) => API.delete(`/bookmark/${id}`);


// User
// http://localhost:8200/api/v1/user/67f12ab491a479ba0e986977
export const getUsers = () => API.get("/user");
export const getUserById = (id) => API.get(`/user/${id}`);
export const signUp = (newUser) => API.post("/user/signUp", newUser);
export const signIn = (newUser) => API.post("/user/signIn", newUser);
export const updateUser = (id, updatedUser) =>
  API.put(`/user/${id}`, updatedUser);

