import { useState, useCallback, useRef, useEffect } from "react";

const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
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
