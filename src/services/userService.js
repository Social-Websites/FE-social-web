import * as httprequest from "../shared/util/httprequest";
export const getUser = async (sendRequest) => {
  try {
    const response = await sendRequest("/users/auth-user");
    return response?.data.user;
  } catch (err) {
    console.log("Lỗi lấy thong tin user:", err);
    throw err;
  }
};

export const getSuggestedUsers = async (sendRequest) => {
  try {
    const response = await sendRequest("/users/suggested");
    return response?.data;
  } catch (err) {
    console.log("Lỗi lấy thong tin gợi ý:", err);
    throw err;
  }
};

export const getUserByUsername = async (username, sendRequest) => {
  try {
    const response = await sendRequest(`/users/${username}`);
    return response?.data.user;
  } catch (err) {
    console.log("Lỗi lấy thông tin người khác:", err);
    throw err;
  }
};

export const getUserFriendsListByUsername = async (
  username,
  page = 1,
  limit = 20,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/users/${username}/friends?page=${page}&limit=${limit}`
    );
    return response?.data;
  } catch (err) {
    console.error("Lỗi lấy list friend:", err);
    throw err;
  }
};

export const getFriendRequestsList = async (
  page = 1,
  limit = 20,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/users/auth-user/friend-requests?page=${page}&limit=${limit}`
    );
    return response?.data;
  } catch (err) {
    console.error("Lỗi lấy list friend request:", err);
    throw err;
  }
};

export const sendAddFriend = async (userId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/users/friend-requests/send/${userId}`,
      "patch"
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const acceptAddFriend = async (userId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/users/friend-requests/accept/${userId}`,
      "patch"
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const removeAddFriend = async (userId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/users/friend-requests/remove/${userId}`,
      "patch"
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const rejectAddFriend = async (userId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/users/friend-requests/reject/${userId}`,
      "patch"
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const unFriend = async (userId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/users/auth-user/unfriend/${userId}`,
      "patch"
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const updateUserProfile = async (data, sendRequest) => {
  try {
    const response = await sendRequest("/users/auth-user", "patch", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const updateUserPassword = async (data, sendRequest) => {
  try {
    const response = await sendRequest(
      "/users/auth-user/change-pass",
      "patch",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const login = async (loginForm, sendRequest) => {
  try {
    const response = await sendRequest("/auth/login", "post", loginForm, {
      headers: { "Content-Type": "application/json" },
    });
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const aLogin = async (loginForm, sendRequest) => {
  try {
    const response = await sendRequest("/auth/alogin", "post", loginForm, {
      headers: { "Content-Type": "application/json" },
    });
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const signUp = async (signUpForm, sendRequest) => {
  try {
    const response = await sendRequest("/auth/signup", "post", signUpForm, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.status !== 201) throw new Error(response?.data?.message);
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getOtpSignUp = async (username, email, sendRequest) => {
  try {
    const response = await sendRequest(`/auth/signup/${username}/${email}`);
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const forgotPassword = async (usernameOrEmail, sendRequest) => {
  try {
    const response = await sendRequest(
      "/auth/forgot-password",
      "post",
      usernameOrEmail,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const verifyResetUrl = async (resetToken, sendRequest) => {
  try {
    const response = await sendRequest(`/auth/reset-password/${resetToken}`);
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const resetPassword = async (resetData, sendRequest) => {
  try {
    const response = await sendRequest(
      "/auth/reset-password",
      "patch",
      resetData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const searchUsers = async (data) => {
  try {
    const response = await httprequest.get(`/users/search?searchText=${data}`);
    return response;
  } catch (error) {
    console.log("Lỗi search users:", error);
    throw new Error("Đã xảy ra lỗi search users");
  }
};
