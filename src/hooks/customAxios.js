import axios from "axios";
import { logout } from "../redux/slices/authSlice";

let token = null;

try {
  const persistRoot = localStorage.getItem("persist:root");
  if (persistRoot) {
    const parsedRoot = JSON.parse(persistRoot);
    if (parsedRoot.user) {
      const parsedUser = JSON.parse(parsedRoot.user);
      token = parsedUser?.token || null;
    }
  }
} catch (error) {
  console.error("Error reading token from localStorage:", error);
}

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export const setupInterceptors = (store) => {
  customFetch.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        store.dispatch(logout());
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

export default customFetch;
