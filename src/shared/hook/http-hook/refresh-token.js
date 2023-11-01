import { useCallback } from "react";
import useAuth from "../auth-hook/auth-hook";
import useHttpClient from "./public-http-hook";

const useRefreshToken = () => {
  const { isLoading, error, clearError, publicRequest } = useHttpClient();
  const { setAuthLogin } = useAuth();

  const refresh = useCallback(async () => {
    const response = await publicRequest("/auth/refresh");

    setAuthLogin(response.data.accessToken);

    return response.data.accessToken;
  }, []);
  return { isLoading, error, clearError, refresh };
};

export default useRefreshToken;
