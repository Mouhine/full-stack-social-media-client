import axios from "axios";

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVICE_URI,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVICE_URI,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
