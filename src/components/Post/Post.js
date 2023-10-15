import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Avatar } from "@mui/material";
import classNames from 'classnames/bind';
import React from "react";
import styles from "./Post.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const cx = classNames.bind(styles)

function Post({ user, postImage, likes, timestamp }) {
  return (
    <div className={cx('post')}>
      <div className={cx("post__header")}>
        <div className={cx("post__headerAuthor")}>
          <Avatar style={{ marginRight: "10px", position: "inherit" }}>
            {user.charAt(0).toUpperCase()}
          </Avatar>{" "}
          {user}2 •   <span>{timestamp}</span>
        </div>
        <MoreHorizIcon />
      </div>
      <div className={cx("post__image")}>
        <img src={postImage} alt="img" />
      </div>
      <div className={cx("post__footer")}>
        <div className={cx("post__footerIcons")}>
          <div className={cx("post__iconsMain")}>
            <FavoriteBorderIcon className={cx("postIcon")} />
            <ChatBubbleOutlineIcon className={cx("postIcon")} />
            <TelegramIcon className={cx("postIcon")} />
          </div>
          <div className={cx("post__iconSave")}>
            <BookmarkBorderIcon className={cx("postIcon")} />
          </div>
        </div>
        {likes} likes
      </div>
    </div>
  );
}

export default Post;