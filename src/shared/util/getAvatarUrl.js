const getAvatarUrl = (profilePicture) => {
  return profilePicture === ""
    ? "/static-resources/default-avatar.jpg"
    : profilePicture;
};

export default getAvatarUrl;
