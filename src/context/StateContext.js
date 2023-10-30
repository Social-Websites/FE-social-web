import { createContext, useEffect, useReducer } from "react";
import StateReducer from "./StateReducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
  currentChat: null,
  messages: [],
  socket: undefined,
};


export const StateContext = createContext(INITIAL_STATE);

export const StateContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(StateReducer, INITIAL_STATE);
  
//   useEffect(()=>{
//     localStorage.setItem("user", JSON.stringify(state.user))
//   },[state.user])
  
  return (
    <StateContext.Provider
      value={{
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