import axios from "axios";

const instance = axios.create({
  baseURL: "https://safarsaathi-backend-ofks.onrender.com",
  // baseURL: "http://localhost:5000",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
