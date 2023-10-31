import { useContext } from "react";
import { StateContext } from "../../context/StateContext";
import { LoginSuccess } from "../../context/StateAction";

const useAuth = () => {
  const { auth, setAuth, dispatch } = useContext(StateContext);
  const getUserLogin = (user) => {
    dispatch(LoginSuccess(user));
  };

  return { auth, setAuth, getUserLogin };
};

export default useAuth;
