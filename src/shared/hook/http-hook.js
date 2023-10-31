import { useState, useCallback, useRef, useEffect } from "react";
import useAxiosInstance from "./axios-instance-hook";

const usePrivateHttpClient = () => {
  const axiosPrivate = useAxiosInstance();

  const [isPrivateLoading, setIsPrivateLoading] = useState(false);
  const [privateError, setPrivateError] = useState();

  const activeHttpRequests = useRef([]);

  const privateRequest = useCallback(
    async (url, method = "GET", body = null, options = {}) => {
      setIsPrivateLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        const response = await axiosPrivate({
          method,
          url,
          data: body,
          options,
          signal: httpAbortCtrl.signal,
        });

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (response?.status >= 400) {
          // Xử lý lỗi khi status code trên 400
          throw new Error(response.data.message);
        }

        setIsPrivateLoading(false);
        return response;
      } catch (err) {
        setPrivateError(err.message);
        setIsPrivateLoading(false);
        throw err;
      }
    },
    []
  );

  const clearPrivateError = () => {
    setPrivateError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return {
    isPrivateLoading,
    privateError,
    clearPrivateError,
    privateRequest,
  };
};

export default usePrivateHttpClient;
