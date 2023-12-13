import React, { useContext, useState } from "react";
import style from "./NotificationItem.module.scss";
import classNames from "classnames/bind";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { acceptAddFriend, rejectAddFriend } from "../../services/userService";
import { StateContext } from "../../context/StateContext";
const cx = classNames.bind(style);
function NotificationItem({ n }) {
  const navigate = useNavigate();
  const privateHttpRequest = usePrivateHttpClient();
  const [decisionLoading, setDecisionLoading] = useState(null);
  const { user, socket } = useContext(StateContext);

  const handleAccept = async () => {
    try {
      setDecisionLoading(true);
      const response = await acceptAddFriend(
        n.sender_id,
        privateHttpRequest.privateRequest
      );
      if (response.message) {
        setDecisionLoading("accept");
      }
    } catch (err) {
      console.error("accept", err);
      setDecisionLoading(false);
    } finally {
      socket.current.emit("sendNotification", {
        sender_id: user?._id,
        receiver_id: [n.sender_id],
        reponse: true,
        type: "accept",
      });
    }
  };
  const handleReject = async () => {
    try {
      setDecisionLoading(true);
      const response = await rejectAddFriend(
        n.sender_id,
        privateHttpRequest.privateRequest
      );
      if (response.message) {
        setDecisionLoading("reject");
      }
    } catch (err) {
      console.error("reject ", err);
      setDecisionLoading(false);
    } finally {
      socket.current.emit("sendNotification", {
        sender_id: user?._id,
        receiver_id: [n.sender_id],
        reponse: false,
        type: "reject",
      });
    }
  };
  return (
    <div
      className={cx("open__user")}
      onClick={() => {
        if (n.content_id) {
          navigate(`/p/${n.content_id}`, { replace: true });
        }
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className={cx("open__user_avatar")}>
          <img
            style={{ width: "44px", height: "44px" }}
            src={!n.img ? "/static-resources/default-avatar.jpg" : n.img}
            alt=""
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className={cx("open__user__info")}>
          <a
            className={cx("open__username")}
            onClick={() => {
              navigate(`/${n.senderName}`, { replace: true });
            }}
          >
            {n.senderName}
          </a>
          <span className={cx("open__relation")}>
            {decisionLoading
              ? decisionLoading === "accept"
                ? " is accepted by you"
                : " is rejected by you"
              : n.content}
          </span>
        </div>
      </div>
      {(!n.content_id && !n.reponse && n.reponse !== false) &&
        (decisionLoading ? (
          decisionLoading === true ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "10px",
              }}
            >
              <CircularProgress size={20} />
            </div>
          ) : null
        ) : ( 
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={handleAccept}
              className={cx("profile-modal__button__accept")}
            >
              ACCEPT
            </button>
            <button
              onClick={handleReject}
              className={cx("profile-modal__button")}
            >
              REJECT
            </button>
          </div>
        ))}
    </div>
  );
}
export default NotificationItem;
