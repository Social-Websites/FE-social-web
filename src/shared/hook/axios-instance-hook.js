import { useCallback, useEffect } from "react";
import useAuth from "./auth-hook";
import axios from "axios";
import { axiosPublic } from "./public-axios";

const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,

  withCredentials: true,
  validateStatus: (status) => {
    return status < 500; // Resolve only if the status code is less than 500
  },
});

const useAxiosInstance = () => {
  const { auth, setAuth } = useAuth();

  const refresh = useCallback(async () => {
    const response = await axiosPublic("/auth/refresh");

    setAuth((prev) => {
      return { ...prev, accessToken: response.accessToken };
    });
    return response.accessToken;
  }, []);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (err) => {
        const prevRequest = err?.config;
        if (err?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosInstance;
