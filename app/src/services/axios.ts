import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`,
  headers: {
    "Content-Type": "application/json",
    "authorization": `Bearer ${process.env.JWT_SECRET}`
  },
});

export default axiosInstance;
