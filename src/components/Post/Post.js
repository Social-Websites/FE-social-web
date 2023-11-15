import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Avatar } from "@mui/material";
import classNames from "classnames/bind";
import React from "react";
import styles from "./Post.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function Post({ post }) {
  return (
    <div className={cx("post")}>
      <div className={cx("post__header")}>
        <div className={cx("post__headerAuthor")}>
          <Link
            to={`/${post.user?.username}`}
            style={{
              marginRight: 10,
              position: "inherit",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Avatar>{post.user?.username?.charAt(0).toUpperCase()}</Avatar>
          </Link>
          &nbsp;
          <Link
            to={`/${post.user?.username}`}
            style={{
              marginRight: 5,
              position: "inherit",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {post.user?.username}
          </Link>
          •<span>{post.timestamp}</span>
        </div>
        <MoreHorizIcon />
      </div>
      <div className={cx("post__image")}>
        <img src={post.postImage} alt="img" />
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
            <div
              className={cx("postIcon")}
              style={{ padding: "7px 0px 7px 7px" }}
            >
              <BookmarkBorderIcon />
            </div>
          </div>
        </div>
        {post.likes} likes
      </div>
    </div>
  );
}

export default Post;
