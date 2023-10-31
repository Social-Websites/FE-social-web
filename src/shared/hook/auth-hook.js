import { useContext } from "react";
import { StateContext } from "../../context/StateContext";
import { LoginFailure, LoginSuccess } from "../../context/StateAction";

const useAuth = () => {
  const { auth, setAuth, dispatch } = useContext(StateContext);
  const getUserLogin = (user) => {
    if (user) dispatch(LoginSuccess(user));
    else dispatch(LoginFailure());
  };

  return { auth, setAuth, getUserLogin };
};

export default useAuth;
