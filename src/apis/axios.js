import axios from "axios";
import apiUrl from "../config";

export default axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json", // ?
  },
});

export const axiosPrivate = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
