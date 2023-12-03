import { Avatar, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Suggestions.scss";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { sendAddFriend } from "../../services/userService";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const SuggestedUser = ({ user }) => {
  const privateHttpRequest = usePrivateHttpClient();
  const [isSentFriendRequest, setIsSentFriendRequest] = useState(
    user?.is_friend_request_sent ? true : false
  );

  const handleAddFriend = async () => {
    if (!isSentFriendRequest) {
      try {
        const response = await sendAddFriend(
          user._id,
          privateHttpRequest.privateRequest
        );
        if (response.message) setIsSentFriendRequest(true);
      } catch (err) {
        console.error(privateHttpRequest.error);
      }
    }
  };

  return (
    <div className={cx("suggestions__username")}>
      <div className={cx("username__left")}>
        <Link
          to={`/${user.username}`}
          className={cx("avatar")}
          style={{ textDecoration: "none" }}
        >
          <img
            src={getAvatarUrl(
              user?.profile_picture ? user?.profile_picture : ""
            )}
            alt=""
          />
        </Link>
        <div className={cx("username__info")}>
          <Link to={`/${user.username}`} style={{ textDecoration: "none" }}>
            <span className={cx("username")}>{user.username}</span>
          </Link>
          <span className={cx("relation")}>Suggested for you</span>
        </div>
      </div>
      <button
        onClick={handleAddFriend}
        className={cx("follow__button")}
        disabled={privateHttpRequest.isLoading || isSentFriendRequest}
      >
        {isSentFriendRequest ? "Has sent" : "Add friend"}
      </button>
    </div>
  );
};

export default SuggestedUser;
