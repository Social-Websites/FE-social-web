import { useCallback } from "react";
import useAuth from "../auth-hook/auth-hook";
import useHttpClient from "./public-http-hook";

const useRefreshToken = () => {
  const { isLoading, error, clearError, publicRequest } = useHttpClient();
  const { auth, setAuth, persist } = useAuth();

  const refresh = async () => {
    const response = await publicRequest("/auth/refresh");

    setAuth((prev) => {
      console.log(prev);
      console.log(response.data.accessToken);
      return {
        ...prev,
        accessToken: response.data.accessToken,
      };
    });

    return response.data.accessToken;
  };
  return { isLoading, error, clearError, auth, persist, refresh };
};

export default useRefreshToken;
