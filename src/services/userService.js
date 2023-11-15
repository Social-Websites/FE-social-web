import * as httprequest from '../shared/util/httprequest';
export const getUser = async (sendRequest) => {
  try {
    const response = await sendRequest("/users/auth-user");
    return response?.data.user;
  } catch (err) {
    console.log("Lỗi lấy thong tin user:", err);
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
      console.log('Lỗi search users:', error);
      throw new Error('Đã xảy ra lỗi search users');
  }
};
