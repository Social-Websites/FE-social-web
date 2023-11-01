import { useContext } from "react";
import { StateContext } from "../../../context/StateContext";
import {
  LoginFailure,
  setUser,
  setPersist,
} from "../../../context/StateAction";

const useAuth = () => {
  const { auth, user, persist, dispatch, setAuth } = useContext(StateContext);

  // const setAuthLogin = (accessToken) => {
  //   if (accessToken) dispatch(setAuth(accessToken));
  //   else dispatch(LoginFailure());
  // };

  const setUserLogin = (user) => {
    if (user) dispatch(setUser(user));
    else dispatch(LoginFailure());
  };

  const setPersistLogin = (persist = true) => {
    dispatch(setPersist(persist));
  };

  return { auth, user, persist, setAuth, setUserLogin, setPersistLogin };
};

export default useAuth;
