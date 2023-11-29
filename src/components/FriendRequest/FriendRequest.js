import classNames from "classnames/bind";
import { React, useState, useEffect, useRef } from "react";
import styles from "./FriendRequest.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { CircularProgress } from "@mui/material";
import { acceptAddFriend, rejectAddFriend } from "../../services/userService";

const cx = classNames.bind(styles);

const FriendRequest = (props) => {
  const privateHttpRequest = usePrivateHttpClient();
  const [isFriend, setIsFriend] = useState(
    props.listType === 1 ? props.item.is_friend : false
  );
  const [isSent, setIsSent] = useState(
    props.listType === 1 ? props.item.is_friend_request_sent : false
  );

  const [decisionLoading, setDecisionLoading] = useState(false);

  const handleAddFriend = () => {
    setIsSent(!isSent);
  };

  const handleAccept = async () => {
    try {
      setDecisionLoading(true);
      const response = await acceptAddFriend(
        props.item._id,
        privateHttpRequest.privateRequest
      );
      if (response.message) {
        props.setRequestDecision(props.item._id, "ACCEPT");
        setDecisionLoading(false);
      }
    } catch (err) {
      console.error("accept ", err);
      setDecisionLoading(false);
    }
  };
  const handleReject = async () => {
    try {
      setDecisionLoading(true);
      const response = await rejectAddFriend(
        props.item._id,
        privateHttpRequest.privateRequest
      );
      if (response.message) {
        props.setRequestDecision(props.item._id, "REJECT");
        setDecisionLoading(false);
      }
    } catch (err) {
      console.error("reject ", err);
      setDecisionLoading(false);
    }
  };

  return (
    <div className={cx("profile-modal__user")}>
      <div className={cx("profile-modal__user_avatar")}>
        <img
          style={{ width: "44px", height: "44px" }}
          src={getAvatarUrl(props.item.profile_picture)}
          alt=""
        />
      </div>
      <div className={cx("profile-modal__user__info")}>
        <span className={cx("profile-modal__username")}>
          {props.item.username}
        </span>
        <span className={cx("profile-modal__relation")}>
          {props.item.full_name}
        </span>
      </div>
      <div>
        {decisionLoading ? (
          <CircularProgress size={20} />
        ) : props.listType === 2 ? (
          <>
            {props.decision === "ACCEPT" ? (
              <span style={{ color: "white" }}>Accept</span>
            ) : props.decision === "REJECT" ? (
              <span style={{ color: "white" }}>Reject</span>
            ) : (
              <>
                <button
                  onClick={handleAccept}
                  className={cx("profile-modal__button__accept")}
                  disabled={decisionLoading}
                >
                  <CheckIcon />
                </button>
                <button
                  onClick={handleReject}
                  className={cx("profile-modal__button")}
                  disabled={decisionLoading}
                >
                  <ClearIcon />
                </button>
              </>
            )}
          </>
        ) : props.listType === 1 ? (
          <>
            {props.myProfile || isFriend ? null : (
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
          </>
        ) : null}
      </div>
    </div>
  );
};

export default FriendRequest;
