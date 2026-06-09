import axios from "axios";

const authApiInstance = axios.create({
  // baseURL: "http://localhost:3000/api/auth",
  // comment out this backend URL because proxy has been set up in vite.config.js
  baseURL: "/api/auth",
  withCredentials: true,
});

export async function register({
  email,
  contact,
  fullname,
  password,
  isSeller,
}) {
  const response = await authApiInstance.post("/register", {
    email,
    contact,
    fullname,
    password,
    isSeller,
  });
  return response.data;
}

export async function login({ email, password }) {
  const response = await authApiInstance.post("/login", {
    email,
    password,
  });
  return response.data;
}
