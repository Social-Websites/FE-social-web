import classNames from "classnames/bind";
import { React, useState, useEffect, useRef } from "react";
import styles from "./FriendRequest.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { CircularProgress } from "@mui/material";
import { acceptAddFriend, rejectAddFriend } from "../../services/userService";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const FriendRequest = (props) => {
  const privateHttpRequest = usePrivateHttpClient();

  const [decisionLoading, setDecisionLoading] = useState(false);

  const handleAddFriend = () => {
    props.setIsSent(props.item._id);
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
        <Link
          to={`/${props.item.username}`}
          className={cx("profile-modal__user_avatar")}
          style={{
            position: "inherit",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <img
            style={{ width: "44px", height: "44px" }}
            src={getAvatarUrl(props.item.profile_picture)}
            alt=""
          />
        </Link>
      </div>
      <div className={cx("profile-modal__user__info")}>
        <Link
          to={`/${props.item.username}`}
          style={{
            position: "inherit",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <span className={cx("profile-modal__username")}>
            {props.item.username}
          </span>
        </Link>
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
            {props.myProfile ||
            props.isFriend ||
            props.yourId === props.item._id ? null : props.isSent ? (
              <span style={{ color: "white" }}>Sent</span>
            ) : (
              <button
                onClick={handleAddFriend}
                className={cx("profile-modal__button__accept")}
              >
                Add Friend
              </button>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default FriendRequest;
