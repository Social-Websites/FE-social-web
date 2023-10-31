import { createContext, useEffect, useReducer, useState } from "react";
import StateReducer from "./StateReducer";

const INITIAL_STATE = {
  auth: null,
  user: null,
  isFetching: false,
  error: false,
  currentChat: null,
  messages: [],
  socket: undefined,
};

export const StateContext = createContext(INITIAL_STATE);

export const StateContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(StateReducer, INITIAL_STATE);

  return (
    <StateContext.Provider
      value={{
        auth: state.auth,
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        currentChat: state.currentChat,
        messages: state.messages,
        socket: state.socket,
        dispatch,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
