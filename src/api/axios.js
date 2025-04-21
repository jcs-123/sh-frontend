import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // 👈 your backend server base URL
  withCredentials: true, // if you're using cookies/sessions
});

export default instance;
