const StateReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };
    case "CURRENT_CHAT":
      return {
        ...state,
        currentChat: action.payload,
      };

    case "SET_SOCKET":
      return {
        ...state,
        socket: action.payload,
      };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };
    case "IS_LOADING_MESSAGES":
      return {
        ...state,
        isLoadingMsg: action.payload,
      };
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_AUTH":
      return {
        ...state,
        auth: action.payload,
      };
    case "SET_PERSIST":
      return {
        ...state,
        persist: action.payload,
      };
    case "SET_REGIS_INFO":
      return {
        ...state,
        regisInfo: action.payload,
      };
    case "SET_OTP_TOKEN":
      return {
        ...state,
        otpToken: action.payload,
      };

    default:
      return state;
  }
};

export default StateReducer;
