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
            <div className={cx("postIcon")}> 
              <FavoriteBorderIcon />
            </div>
            <div className={cx("postIcon")}> 
              <ChatBubbleOutlineIcon />
            </div>
            <div className={cx("postIcon")}> 
              <TelegramIcon />
            </div>
          </div>
          <div className={cx("post__iconSave")}>
            <div className={cx("postIcon")} style={{padding: "7px 0px 7px 7px"}}> 
              <BookmarkBorderIcon />
            </div>
          </div>
        </div>
        {likes} likes
      </div>
    </div>
  );
}

export default Post;