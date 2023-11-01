import { useContext } from "react";
import { StateContext } from "../../../context/StateContext";
import { LoginFailure, setAuth, setUser } from "../../../context/StateAction";

const useAuth = () => {
  const { auth, user, persist, dispatch } = useContext(StateContext);

  const setAuthLogin = (accessToken) => {
    if (accessToken) dispatch(setAuth(accessToken));
    else dispatch(LoginFailure());
  };

  const setUserLogin = (user) => {
    if (user) dispatch(setUser(user));
    else dispatch(LoginFailure());
  };

  const setPersistLogin = (persist = true) => {
    dispatch(persist);
  };

  return { auth, user, persist, setAuthLogin, setUserLogin, setPersistLogin };
};

export default useAuth;
