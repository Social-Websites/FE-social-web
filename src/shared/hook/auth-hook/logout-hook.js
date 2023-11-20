import useAuth from "./auth-hook";
import useHttpClient from "../http-hook/public-http-hook";
import { useContext } from "react";
import { StateContext } from "../../../context/StateContext";
import { setAuth, setPosts } from "../../../context/StateAction";

const useLogout = () => {
  const { setUserLogin, setPersistLogin } = useAuth();
  const { dispatch } = useContext(StateContext);
  const { isLoading, error, clearError, publicRequest } = useHttpClient();

  const logout = async () => {
    setAuth(null);
    setUserLogin(null);
    setPersistLogin(false);
    dispatch(setPosts([]));
    try {
      const response = await publicRequest("/auth/logout");
    } catch (err) {
      console.log(err);
    }
  };

  return { isLoading, error, clearError, logout };
};

export default useLogout;
