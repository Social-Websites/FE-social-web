export const createGroup = async (formData, sendRequest) => {
    try {
      const response = await sendRequest("/groups/create", "post", formData, {
        headers: { "Content-Type": "application/json" },
      });
      // if (response?.status !== 201) throw new Error(response?.data?.message);
  
      return response?.data;
    } catch (err) {
      throw err;
    }
  };
  
export const getAdminGroups = async (sendRequest) => {
    try {
      const response = await sendRequest(`/groups/admin`);
  
      return response?.data;
    } catch (err) {
      throw err;
    }
};

export const getMemberGroups = async (sendRequest) => {
    try {
      const response = await sendRequest(`/groups/member`);
  
      return response?.data;
    } catch (err) {
      throw err;
    }
};

export const getInvitedGroups = async (sendRequest) => {
    try {
      const response = await sendRequest(`/groups/invited`);
  
      return response?.data;
    } catch (err) {
      throw err;
    }
};

export const searchGroups = async (search, sendRequest) => {
    try {
      const response = await sendRequest(`/groups/search?searchText=${search}`);
  
      return response?.data;
    } catch (err) {
      throw err;
    }
};

export const requestToGroup = async (groupId, sendRequest) => {
  try {
    const response = await sendRequest(`/groups/request?groupId=${groupId}`, "post", {
      headers: { "Content-Type": "application/json" },
    });

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const deleteToGroup = async (groupId, sendRequest) => {
  try {
    const response = await sendRequest(`/groups/kick?groupId=${groupId}`, "put", {
      headers: { "Content-Type": "application/json" },
    });

    return response?.data;
  } catch (err) {
    throw err;
  }
};



export const acceptToGroup = async (groupId, sendRequest) => {
  try {
    const response = await sendRequest(`/groups/accept?groupId=${groupId}`, "put", {
      headers: { "Content-Type": "application/json" },
    });

    return response?.data;
  } catch (err) {
    throw err;
  }
};
