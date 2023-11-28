import React from "react";
import classNames from "classnames/bind";
import styles from "./Post.scss";

const cx = classNames.bind(styles);

const ProfilePost = ({ post }) => {
  return (
    <div className={cx("profile__post")}>
      <img src={post.media[0]} />
    </div>
  );
};

export default ProfilePost;
