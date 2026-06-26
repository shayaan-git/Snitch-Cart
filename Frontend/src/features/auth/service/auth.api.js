import axios from "axios";

const authApiInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});
/*
baseURL: "http://localhost:3000/api/auth",
comment out this backend URL because proxy has been set up in vite.config.js
*/

// In network tab it shows ↪ http://localhost:5173/api/auth/register
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

// In network tab it shows ↪ http://localhost:5173/api/auth/login
export async function login({ email, password }) {
  const response = await authApiInstance.post("/login", {
    email,
    password,
  });
  return response.data;
}

// In network tab it shows ↪ http://localhost:5173/api/auth/me
export async function getMe() {
  const response = await authApiInstance.get("/me");
  return response.data;
}

// In network tab it shows ↪ http://localhost:5173/api/auth/logout
export async function logout() {
  const response = await authApiInstance.post("/logout");
  return response.data;
}
