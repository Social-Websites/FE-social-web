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
        isLoadingMsg: true,
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
    case "LOAD_MORE_MESSAGES":
      return {
        ...state,
        messages: [...action.payload, ...state.messages],
      };
    case "SET_POSTS":
      const postsWithReactMaps = convertReactsArrayToMap(action.payload);

      return {
        ...state,
        posts: new Map(postsWithReactMaps.map((post) => [post._id, post])),
      };
    case "ADD_CREATED_POST":
      const newPostWithReactMap = convertReactsArrayToMap([action.payload])[0];

      return {
        ...state,
        posts: new Map([
          [newPostWithReactMap._id, newPostWithReactMap],
          ...state.posts.entries(),
        ]),
      };
    case "ADD_POSTS":
      const postsWithReactMapsToAdd = convertReactsArrayToMap(action.payload);

      return {
        ...state,
        posts: new Map([
          ...state.posts.entries(),
          ...postsWithReactMapsToAdd.map((post) => [post._id, post]),
        ]),
      };
    case "UPDATE_POST_REACT":
      const { postId, userId, emoji } = action.payload;

      let reactPost;

      // Kiểm tra xem post có tồn tại trong danh sách không
      if (state.posts.has(postId)) {
        // Lấy ra post từ Map
        reactPost = state.posts.get(postId);

        // Kiểm tra xem người dùng đã thích bài viết chưa
        const existingReact = reactPost.reacts.get(userId);

        console.log("post cần like", reactPost);

        if (existingReact) {
          // Nếu đã thích, kiểm tra emoji
          if (existingReact.emoji === emoji) {
            console.log("hủy like");
            // Nếu emoji giống nhau, hủy tương tác
            reactPost.reacts.delete(userId);
          } else {
            console.log("thay đổi react");
            // Nếu emoji khác nhau, cập nhật emoji
            reactPost.reacts.emoji = emoji;
          }
        } else {
          console.log("like bài");
          // Nếu chưa tương tác, thêm một react mới
          reactPost.reacts.set(userId, { user: userId, emoji: emoji });
        }
      }

      return {
        ...state,
        posts: new Map([...state.posts.entries(), [reactPost._id, reactPost]]),
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

// Hàm helper để lọc các bài viết mới
const filterUniqueNewPosts = (statePosts, newPosts) => {
  return newPosts.filter(
    (newPost) => !statePosts.some((prevPost) => prevPost?._id === newPost._id)
  );
};

const convertReactsArrayToMap = (postsArray) => {
  return postsArray.map((post) => {
    // Chuyển đổi reacts array thành Map
    const reactsMap = new Map(post.reacts.map((react) => [react.user, react]));

    // Trả về post với reacts là một Map
    return { ...post, reacts: reactsMap };
  });
};

export default StateReducer;
