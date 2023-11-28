import classNames from "classnames/bind";
import { React, useState, useEffect, useRef } from "react";
import styles from "./FriendRequest.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";

const cx = classNames.bind(styles);

const FriendRequest = (props) => {
  const privateHttpRequest = usePrivateHttpClient();
  const [isFriend, setIsFriend] = useState(props.user?.is_friend);
  const [isSent, setIsSent] = useState(props.user?.is_sent_request);

  const handleAddFriend = () => {
    setIsSent(!isSent);
  };

  return (
    <div className={cx("profile-modal__user")}>
      <div className={cx("profile-modal__user_avatar")}>
        <img
          style={{ width: "44px", height: "44px" }}
          src={getAvatarUrl(props.user?.profile_url)}
          alt=""
        />
      </div>
      <div className={cx("profile-modal__user__info")}>
        <span className={cx("profile-modal__username")}>
          {props.user?.username}
        </span>
        <span className={cx("profile-modal__relation")}>
          {props.user?.full_name}
        </span>
      </div>
      <div>
        {props.friendRequests ? (
          <>
            <button className={cx("profile-modal__button__accept")}>
              <CheckIcon />
            </button>
            <button className={cx("profile-modal__button")}>
              <ClearIcon />
            </button>
          </>
        ) : props.myProfile ? null : isFriend ? null : (
          <button
            onClick={handleAddFriend}
            className={
              isSent
                ? cx("profile-modal__button")
                : cx("profile-modal__button__accept")
            }
          >
            {isSent ? "Sent" : "Add"}
          </button>
        )}
      </div>
    </div>
  );
};

export default FriendRequest;
