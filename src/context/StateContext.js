import { createContext, useEffect, useReducer, useState } from "react";
import StateReducer from "./StateReducer";

const INITIAL_STATE = {
  persist: JSON.parse(localStorage.getItem("persist") || false),
  regisInfo: null,
  otpToken: null,
  user: null,
  isFetching: false,
  isLoadingMsg: true,
  error: false,
  currentChat: null,
  posts: new Map(),
  conversations: [],
  messages: [],
  socket: undefined,
};

export const StateContext = createContext(INITIAL_STATE);

export const StateContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(StateReducer, INITIAL_STATE);
  const [auth, setAuth] = useState({});

  useEffect(() => {
    //console.log(state.persist);
    localStorage.setItem("persist", state.persist ? true : false);
  }, [state.persist]);

  return (
    <StateContext.Provider
      value={{
        persist: state.persist,
        regisInfo: state.regisInfo,
        otpToken: state.otpToken,
        auth: auth,
        user: state.user,
        isFetching: state.isFetching,
        isLoadingMsg: state.isLoadingMsg,
        error: state.error,
        currentChat: state.currentChat,
        posts: state.posts,
        conversations: state.conversations,
        messages: state.messages,
        socket: state.socket,
        dispatch,
        setAuth,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
