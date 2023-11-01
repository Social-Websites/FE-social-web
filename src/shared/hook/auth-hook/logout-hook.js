import useAuth from "./auth-hook";
import useHttpClient from "../http-hook/public-http-hook";

const useLogout = () => {
  const { setAuthLogin, setPersistLogin } = useAuth();
  const { isLoading, error, clearError, publicRequest } = useHttpClient();

  const logout = async () => {
    setAuthLogin(null);
    setPersistLogin(false);
    try {
      const response = await publicRequest("/auth/logout");
    } catch (err) {
      console.log(err);
    }
  };

  return { isLoading, error, clearError, logout };
};

export default useLogout;
