import React, { useContext, useState } from "react";
import style from "./NotificationItem.module.scss";
import classNames from "classnames/bind";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { acceptAddFriend, rejectAddFriend } from "../../services/userService";
import { StateContext } from "../../context/StateContext";

import { deleteToGroup, acceptToGroup, acceptRequestToGroup, rejectRequestToGroup } from "../../services/groupService";

const cx = classNames.bind(style);
function NotificationItem({ n }) {
  const navigate = useNavigate();
  const privateHttpRequest = usePrivateHttpClient();
  const [decisionLoading, setDecisionLoading] = useState(null);
  const { user, socket } = useContext(StateContext);

  const handleAccept = async () => {
    try {
      setDecisionLoading("run");
      const response = await acceptAddFriend(
        n.sender_id,
        privateHttpRequest.privateRequest
      );
      if (response.message) {
        setDecisionLoading("accept");
        socket.current.emit("sendNotification", {
          sender_id: user?._id,
          receiver_id: [n.sender_id],
          reponse: true,
          type: "accept",
        });
      }
    } catch (err) {
      console.error("accept", err);
      setDecisionLoading(false);
    }
  };
  const handleReject = async () => {
    try {
      setDecisionLoading("run");
      const response = await deleteToGroup(
        n.sender_id,
        privateHttpRequest.privateRequest
      );
      if (response.message) {
        setDecisionLoading("reject");
        socket.current.emit("sendNotification", {
          sender_id: user?._id,
          receiver_id: [n.sender_id],
          reponse: false,
          type: "reject",
        });
      }
    } catch (err) {
      console.error("reject ", err);
      setDecisionLoading(false);
    }
  };

  const handleAcceptGroup = async () => {
    try {
      setDecisionLoading("run");
      const response = await acceptToGroup(
        n.group_id,
        privateHttpRequest.privateRequest
      );
      if (response !== null) {
        setDecisionLoading("accept");
        socket.current.emit("sendNotification", {
          sender_id: user?._id,
          receiver_id: [n.sender_id],
          group_id: n.group_id,
          reponse: true,
          type: "acceptGroup",
        });
      }
    } catch (err) {
      console.error("accept", err);
      setDecisionLoading(false);
    }
  };
  const handleRejectGroup = async () => {
    try {
      setDecisionLoading("run");
      const response = await deleteToGroup(
        n.group_id,
        privateHttpRequest.privateRequest
      );
      if (response !== null) {
        setDecisionLoading("reject");
        socket.current.emit("sendNotification", {
          sender_id: user?._id,
          receiver_id: [n.sender_id],
          group_id: n.group_id,
          reponse: false,
          type: "rejectGroup",
        });
      }
    } catch (err) {
      console.error("reject ", err);
      setDecisionLoading(false);
    }
  };

  const handleAcceptMember = async () => {
    try {
      setDecisionLoading("run");
      const response = await acceptRequestToGroup(
        n.group_id,
        n.sender_id,
        privateHttpRequest.privateRequest
      );

      if (response.message) {
        setDecisionLoading("accept");
        socket.current.emit("sendNotification", {
          sender_id: user?._id,
          receiver_id: [n.sender_id],
          group_id: n.group_id,
          reponse: true,
          type: "acceptMember",
        });
      }
    } catch (err) {
      console.error("accept", err);
      setDecisionLoading(false);
    }
    //  finally {
    //   socket.current.emit("sendNotification", {
    //     sender_id: user?._id,
    //     receiver_id: [props.item._id],
    //     reponse: true,
    //     type: "accept",
    //   });
    // }
  };
  const handleRejectMember = async () => {
    try {
      setDecisionLoading(true);
      const response = await rejectRequestToGroup(
        n.group_id,
        n.sender_id,
        privateHttpRequest.privateRequest
      );

      if (response.message) {
        setDecisionLoading("reject");
        socket.current.emit("sendNotification", {
          sender_id: user?._id,
          receiver_id: [n.sender_id],
          group_id: n.group_id,
          reponse: false,
          type: "rejectMember",
        });
      }
    } catch (err) {
      console.error("reject ", err);
      setDecisionLoading(false);
    }
  };
  return (
    <>
    {n.group_id ? 
      (
      <div
        className={cx("open__user")}
        onClick={() => {
          if (n.content_id) {
            navigate(`/g/${n.group_id}/p/${n.content_id}`, { replace: true });
          }
        }}
      >
        <div style={{display: "flex"}}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className={cx("open__user_avatar")}>
              {n?.content === " has been a member of your group" ||  n?.content === " want to join " ?
                <img
                  style={{ width: "44px", height: "44px" }}
                  src={!n.img ? "/static-resources/default-avatar.jpg" : n.img}
                  alt=""
                /> : 
                <img
                  style={{ width: "44px", height: "44px", borderRadius: "10px"}}
                  src={n.group_cover}
                  alt=""
                />
              }
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className={cx("open__user__info")}>
            {n?.reponse ||  n?.content === " want to join " ?
              <a
                className={cx("open__username")}
                onClick={() => {
                  navigate(`/${n.senderName}`, { replace: true });
                }}
              >
                {n.senderName}
              </a> : <a
                className={cx("open__username")}
                onClick={() => {
                  navigate(`/g/${n.group_id}`, { replace: true });
                }}
              >
                {n.group_name}
              </a>
            }
              <span className={cx("open__relation")}>
                {decisionLoading
                  ? decisionLoading === "accept"
                    ? " is accepted by you"
                    : " is rejected by you"
                  : (n?.content === " want to join " ? (n?.content + n.group_name) : n?.content)}
              </span>
            </div>
          </div>
        </div>
        {(!n.content_id && !n.reponse && n.reponse !== false) &&
          (decisionLoading ? (
            decisionLoading === "run" ? (
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 50px 0px 50px"}}>
              <button
                onClick={n?.content === " want to join " ? handleAcceptMember : handleAcceptGroup}
                className={cx("profile-modal__button__accept")}
              >
                ACCEPT
              </button>
              <button
                onClick={n?.content === " want to join " ? handleRejectMember : handleRejectGroup}
                className={cx("profile-modal__button")}
              >
                REJECT
              </button>
            </div>
          ))}
      </div>
      ) : (
        
        <div
          className={cx("open__user")}
          onClick={() => {
            if (n.content_id) {
              navigate(`/p/${n.content_id}`, { replace: true });
            }
          }}
        >
          <div style={{display: "flex"}}>
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
          </div>
          {(!n.content_id && !n.reponse && n.reponse !== false) &&
            (decisionLoading ? (
              decisionLoading === "run" ? (
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 50px 0px 50px"}}>
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
      )
    }
    </>
  );
}
export default NotificationItem;
