import axios from "axios";
export const URL =
  "https://myauthurl/";
export const LOGOUT_URL =
  "https://myauthlogouturl;
var axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = window.accessToken ? window.accessToken : "dummy token";
    config.headers["Authorization"] = "bearer " + token;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default axiosInstance;
