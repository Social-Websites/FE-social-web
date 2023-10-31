export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
});

export const Follow = (userId) => ({
  type: "FOLLOW",
  payload: userId,
});

export const Unfollow = (userId) => ({
  type: "UNFOLLOW",
  payload: userId,
});

export const currentChat = (conversation) => ({
  type: "CURRENT_CHAT",
  payload: conversation,
});
export const setMessages = (messages) => ({
  type: "SET_MESSAGES",
  payload: messages,
});
export const setSocket = (socket) => ({
  type: "SET_SOCKET",
  payload: socket,
});
export const sendMessage = (newMessage) => ({
  type: "ADD_MESSAGE",
  payload: newMessage,
});
export const setUser = (user) => ({
  type: "SET_USER",
  payload: user,
});
export const setAuth = (accessToken) => ({
  type: "SET_AUTH",
  payload: accessToken,
});
