import { useEffect } from "react";
import useAuth from "./auth-hook";
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,

  withCredentials: true,
  validateStatus: (status) => {
    return status < 500; // Resolve only if the status code is less than 500
  },
});

const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,

  withCredentials: true,
  validateStatus: (status) => {
    return status < 500; // Resolve only if the status code is less than 500
  },
});

const useAxiosInstance = (privateCall = false) => {
  const { auth, setAuth } = useAuth();
  const refresh = async () => {
    const response = await axiosPublic("/auth/refresh");

    setAuth((prev) => {
      return { ...prev, accessToken: response.accessToken };
    });
    return response.accessToken;
  };

  const axiosInstance = privateCall ? axiosPrivate : axiosPublic;

  useEffect(() => {
    if (privateCall) {
      const requestIntercept = axiosInstance.interceptors.request.use(
        (config) => {
          if (!config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
          }
          return config;
        },
        (err) => Promise.reject(err)
      );

      const responseIntercept = axiosInstance.interceptors.response.use(
        (response) => response,
        async (err) => {
          const prevRequest = err?.config;
          if (err?.response?.status === 403 && !prevRequest?.sent) {
            prevRequest.sent = true;
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosInstance(prevRequest);
          }
        }
      );

      return () => {
        axiosInstance.interceptors.request.eject(requestIntercept);
        axiosInstance.interceptors.response.eject(responseIntercept);
      };
    }
  }, [auth, refresh]);

  return axiosInstance;
};

export default useAxiosInstance;
