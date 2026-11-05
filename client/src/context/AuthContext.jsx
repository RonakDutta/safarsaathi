import { useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "./authContext";

const readStoredUser = () => {
  try {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    return token && stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const isAuthenticated = Boolean(user);

  const saveSession = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/auth/login", { email, password });
      if (!response.data.token) throw new Error("No token returned");
      saveSession(response.data);
      toast.success("Logged in");
      return response.data.user;
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.error || "Login failed");
      return null;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post("/auth/register", {
        name,
        email,
        password,
      });
      if (!response.data.token) throw new Error("No token returned");
      saveSession(response.data);
      toast.success("Account created");
      return response.data.user;
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.error || "Sign up failed");
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
