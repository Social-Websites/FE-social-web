import { useContext } from "react";
import { StateContext } from "../../context/StateContext";

const useAuth = () => {
  return useContext(StateContext);
};

export default useAuth;
