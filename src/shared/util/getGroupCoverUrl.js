const getGroupCoverUrl = (cover) => {
  return cover === "" ? "/static-resources/default-cover.jpg" : cover;
};

export default getGroupCoverUrl;
