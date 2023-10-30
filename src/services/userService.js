import * as httprequest from "../shared/util/httprequest";

export const getUser = async () => {
  try {
    const response = await httprequest.get(`/users/getuser`);
    return response;
  } catch (error) {
    console.log("Lỗi lấy thong tin user:", error);
    throw new Error("Đã xảy ra lỗi lấy thong tin user");
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
