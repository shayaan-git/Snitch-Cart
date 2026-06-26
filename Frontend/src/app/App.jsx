import { useEffect } from "react";
import { RouterProvider } from "react-router";
import "./App.css";
import { routes } from "./app.routes.jsx";
import { useSelector } from "react-redux";
import { useAuth } from "../features/auth/hook/useAuth.js";

function App() {
  const { handleGetMe } = useAuth();

  const user = useSelector((state) => state.auth.user);

  console.log(user);

  useEffect(() => {
    handleGetMe();
  }, []);

  /**
   * Ye pattern "Persistent Login" kehlaata hai — user ko baar baar login nahi karna padta, browser band karke khola toh bhi session yaad rehta hai (cookie/token ki wajah se).
   */

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
