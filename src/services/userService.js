import * as httprequest from "../shared/util/httprequest";

export const getUser = async (sendRequest) => {
  try {
    const response = await sendRequest("/users/getuser");
    console.log("lấy được nè");
    return response?.data.user;
  } catch (err) {
    console.log("Lỗi lấy thong tin user:", err);
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
    return true;
  } catch (err) {
    throw err;
  }
};
