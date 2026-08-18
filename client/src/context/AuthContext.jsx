import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";

// 1. Create the Context
export const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- A. CHECK IF USER IS ALREADY LOGGED IN (On Refresh) ---
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // We don't have a /verify route yet, so we just decode the LocalStorage for now
          // Later we will add a backend verify route for extra security
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error("Token verification failed");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // --- B. LOGIN FUNCTION ---
  const login = async (email, password) => {
    try {
      const response = await axios.post("/auth/login", { email, password });

      if (response.data.token) {
        // 1. Save to Local Storage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // 2. Update State
        setIsAuthenticated(true);
        setUser(response.data.user);

        toast.success("Login Successful!");
        return true;
      }
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.error || "Login Failed");
      return false;
    }
  };

  // --- C. REGISTER FUNCTION ---
  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post("/auth/register", {
        name,
        email,
        password,
        role: role || "customer",
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setIsAuthenticated(true);
        setUser(response.data.user);

        toast.success("Account Created!");
        return true;
      }
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.error || "Signup Failed");
      return false;
    }
  };

  // --- D. LOGOUT FUNCTION ---
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    toast.success("Logged out successfully");
  };

  // --- E. EXPORT VALUES ---
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
