import { setUser, setLoading, setError } from "../state/auth.slice.js";
import { getMe, login, logout, register } from "../service/auth.api.js";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({
    email,
    contact,
    password,
    fullname,
    isSeller = false,
  }) {
    const data = await register({
      email,
      contact,
      password,
      fullname,
      isSeller,
    });

    dispatch(setUser(data.user));
    return data.user;
  }

  async function handleLogin({ email, password }) {
    const data = await login({ email, password });
    dispatch(setUser(data.user));
    return data.user;
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      await logout();
      dispatch(setUser(null));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setUser(null));
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, handleGetMe, handleLogout };
};
