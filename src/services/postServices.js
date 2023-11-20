export const createPost = async (formData, sendRequest) => {
  try {
    const response = await sendRequest("/posts", "post", formData, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.status !== 201) throw new Error(response?.data?.message);

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getHomePosts = async (page = 1, limit = 10, sendRequest) => {
  try {
    const response = await sendRequest(`/posts?page=${page}?limit=${limit}`);

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const reactPost = async (data, sendRequest) => {
  try {
    const response = await sendRequest(
      `/posts/react/${data.postId}`,
      "patch",
      { emoji: data.emoji },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};