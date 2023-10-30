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

  const GetReq = (url, headers = {}) => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          return await sendRequest(url, headers);
        } catch (err) {}
      };
      fetchData();
    }, [sendRequest]);
  };

  const PostReq = (url, body, headers = {}) => {
    const PostData = async () => {
      try {
        return await sendRequest(url, "POST", JSON.stringify(body), headers);
      } catch (err) {}
    };
    PostData();
  };

  const PutReq = (url, body, headers = {}) => {
    const PutData = async () => {
      try {
        return await sendRequest(url, "PUT", JSON.stringify(body), headers);
      } catch (err) {}
    };
    PutData();
  };

  const PatchReq = (url, body, headers = {}) => {
    const PatchData = async () => {
      try {
        return await sendRequest(url, "PATCH", JSON.stringify(body), headers);
      } catch (err) {}
    };
    PatchData();
  };

  const DeleteReq = (url, headers = {}) => {
    const DeleteData = async () => {
      try {
        return await sendRequest(url, "DELETE", headers);
      } catch (err) {}
    };
    DeleteData();
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
    GetReq,
    PostReq,
    PutReq,
    PatchReq,
    DeleteReq,
  };
};

export default useHttpClient;
