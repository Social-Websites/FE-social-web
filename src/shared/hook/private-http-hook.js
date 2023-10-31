import { useState, useCallback, useRef, useEffect } from "react";
import useAxiosInstance from "./private-axios-hook";

const usePrivateHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const axiosPrivate = useAxiosInstance();

  const activePrivateHttpRequests = useRef([]);

  const privateRequest = useCallback(
    async (url, method = "get", body = null, options = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activePrivateHttpRequests.current.push(httpAbortCtrl);
      try {
        const response = await axiosPrivate({
          method,
          url,
          data: body,
          options,
          signal: httpAbortCtrl.signal,
        });

        activePrivateHttpRequests.current =
          activePrivateHttpRequests.current.filter(
            (reqCtrl) => reqCtrl !== httpAbortCtrl
          );

        if (response.status >= 400) {
          // Xử lý lỗi khi status code trên 400
          throw new Error(response.data.message);
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
      activePrivateHttpRequests.current.forEach((abortCtrl) =>
        abortCtrl.abort()
      );
    };
  }, []);

  return {
    isLoading,
    error,
    clearError,
    privateRequest,
  };
};

export default usePrivateHttpClient;
