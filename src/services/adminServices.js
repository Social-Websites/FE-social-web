export const getQuickOverview = async (sendRequest) => {
  try {
    const response = await sendRequest("/admin/statistic");

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getAdminPosts = async (page, limit, sendRequest, search = "") => {
  try {
    const response = await sendRequest(
      `/admin/post?page=${page}&limit=${limit}&search=${search}`
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getAdminUsers = async (page, limit, sendRequest, search = "") => {
  try {
    const response = await sendRequest(
      `/admin/user?page=${page}&limit=${limit}&search=${search}`
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getTopAuthors = async (sendRequest) => {
  try {
    const response = await sendRequest("/admin/user/mostpost");

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const banUsers = async (id, sendRequest) => {
  try {
    const response = await sendRequest(`/admin/user/ban/${id}`, "put");

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const unBanUsers = async (id, sendRequest) => {
  try {
    const response = await sendRequest(`/admin/user/unban/${id}`, "put");

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const createUser = async (data, sendRequest) => {
  try {
    const response = await sendRequest(`/admin/users`, "post", data, {
      headers: { "Content-Type": "application/json" },
    });

    return response?.data;
  } catch (err) {
    throw err;
  }
};
