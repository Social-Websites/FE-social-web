import { useState, useCallback, useRef, useEffect } from "react";
import useAxiosInstance from "./axios-instance-hook";

const useHttpClient = (privateCall = false) => {
  const axiosInstance = useAxiosInstance(privateCall);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, options = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        const response = await axiosInstance({
          method,
          url,
          data: body,
          options,
          signal: httpAbortCtrl.signal,
        });

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (response.status >= 400) {
          // Xử lý lỗi khi status code trên 400
          throw new Error(response?.data?.message);
        }

        setIsLoading(false);
        return response;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return {
    isLoading,
    error,
    clearError,
    sendRequest,
  };
};

export default useHttpClient;
