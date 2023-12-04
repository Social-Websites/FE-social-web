export const getQuickOverview = async (sendRequest) => {
  try {
    const response = await sendRequest("/admin/statistic");

    return response?.data;
  } catch (err) {
    throw err;
  }
};
