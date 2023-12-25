import classNames from "classnames/bind";
import { React, useState, useEffect, useContext, forwardRef } from "react";
import styles from "./UserRequestGroup.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { CircularProgress } from "@mui/material";
import { StateContext } from "../../context/StateContext";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import {
  acceptRequestToGroup,
  acceptToGroup,
  inviteUserToGroup,
  rejectRequestToGroup,
} from "../../services/groupService";

const cx = classNames.bind(styles);
function GroupInvited({
  user,
  setUser,
  setGroupDetail,
  isGroupAdmin,
  groupOwner,
  type,
}) {
  const authObj = useAuth();
  const { id } = useParams();
  const privateHttpClient = usePrivateHttpClient();

  const [decisionLoading, setDecisionLoading] = useState(false);
  const {socket} = useContext(StateContext);
  const handleAccept = async () => {
    try {
      setDecisionLoading(true);
      const response = await acceptRequestToGroup(
        id,
        user._id,
        privateHttpClient.privateRequest
      );

      if (response.message) {
        setUser((prev) => prev.filter((item) => item._id !== user._id));
        setGroupDetail((prev) => ({
          ...prev,
          requests_count: prev.requests_count - 1,
          members_count: prev.members_count + 1,
        }));

        setDecisionLoading(false);

        socket.current.emit("sendNotification", {
          sender_id: groupOwner._id,
          receiver_id: [user._id],
          group_id: id,
          reponse: true,
          type: "acceptMember",
        });
      }
    } catch (err) {
      console.error("accept ", err);
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
  const handleReject = async () => {
    try {
      setDecisionLoading(true);
      const response = await rejectRequestToGroup(
        id,
        user._id,
        privateHttpClient.privateRequest
      );

      if (response.message) {
        setUser((prev) => prev.filter((item) => item._id !== user._id));

        setGroupDetail((prev) => ({
          ...prev,
          members_count: prev.members_count - 1,
        }));

        setDecisionLoading(false);
        socket.current.emit("sendNotification", {
          sender_id: groupOwner._id,
          receiver_id: [user._id],
          group_id: id,
          reponse: true,
          type: "rejectMember",
        });
      }
    } catch (err) {
      console.error("reject ", err);
      setDecisionLoading(false);
    }
  };

  const handleKick = async () => {
    try {
      setDecisionLoading(true);
      const response = await rejectRequestToGroup(
        id,
        user._id,
        privateHttpClient.privateRequest
      );

      if (response.message) {
        setUser((prev) => prev.filter((item) => item._id !== user._id));

        setGroupDetail((prev) => ({
          ...prev,
          requests_count: prev.requests_count - 1,
        }));

        setDecisionLoading(false);
      }
    } catch (err) {
      console.error("kick ", err);
      setDecisionLoading(false);
    }
  };

  const handleInvite = async () => {
    try {
      setDecisionLoading(true);
      const response = await inviteUserToGroup(
        id,
        user._id,
        privateHttpClient.privateRequest
      );
      console.log(response);
      if (response.message) {
        setUser((prev) =>
          prev.map((item) =>
            item._id === user._id ? { ...item, status: "INVITED" } : item
          )
        );
        setDecisionLoading(false);
        socket.current.emit("sendNotification", {
          sender_id: groupOwner._id,
          receiver_id: [user._id],
          group_id: id,
          type: "inviteGroup",
        });
      }
    } catch (err) {
      console.error("invite ", err);
      setDecisionLoading(false);
    }
  };

  return (
    <div className={cx("modal__group")}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          to={`/${user.username}/`}
          className={cx("modal__group_avatar")}
          style={{
            position: "inherit",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <img
            style={{ width: "44px", height: "44px" }}
            src={getAvatarUrl(user.profile_picture)}
            alt=""
          />
        </Link>
      </div>
      <div className={cx("modal__group__info")}>
        <Link
          to={`/${user.username}/`}
          style={{
            position: "inherit",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <span className={cx("modal__group__username")}>{user.username}</span>
        </Link>
        {type === 3 && (
          <span className={cx("modal__group__relation")}>
            {user._id === groupOwner._id ? "GROUP OWNER" : user.status}
          </span>
        )}
      </div>
      {type === 1 ? (
        <div>
          {/* {props.decision === "ACCEPT" ? (
                <span style={{ color: "white" }}>Accepted</span>
                ) : props.decision === "REJECT" ? (
                <span style={{ color: "white" }}>Rejected</span>
                ) : ( */}

          <>
            <button
              onClick={handleAccept}
              className={cx("modal__group__button__accept")}
              disabled={decisionLoading}
            >
              <CheckIcon />
            </button>
            <button
              onClick={handleReject}
              className={cx("modal__group__button")}
              disabled={decisionLoading}
            >
              <ClearIcon />
            </button>
          </>
          {/* )} */}
        </div>
      ) : type === 2 ? (
        <div style={
          { display: "flex", alignItems: "center" }
         }>
          {user.status === "NONE" ? (
            <button
              onClick={handleInvite}
              className={cx("modal__group__button__accept")}
              disabled={decisionLoading}
            >
              Invite
            </button>
          ) : user.status === "MEMBER" || user.status === "ADMIN" ? (
            <div
            >
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "white",
                  fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
                }}
              >
                Has joined
              </span>
            </div>
          ) : user.status === "INVITED" ? (
            <div
              style={
                { display: "flex", alignItems: "center" }
              }
            >
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "white",
                  fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
                }}
              >
                Has invited
              </span>
            </div>
          ) : (
            user.status === "REQUESTED" && (
              <div
                style={
                  {
                    display: "flex",
                    alignItems: "center",
                  }
                }
              >
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "white",
                    fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
                  }}
                >
                  Has requested to join
                </span>
              </div>
            )
          )}
        </div>
      ) : (
        <div>
          {/* {props.decision === "ACCEPT" ? (
                <span style={{ color: "white" }}>Accepted</span>
                ) : props.decision === "REJECT" ? (
                <span style={{ color: "white" }}>Rejected</span>
                ) : ( */}

          {user._id !== groupOwner._id &&
            isGroupAdmin &&
            authObj.user._id !== user._id && (
              <button
                onClick={handleKick}
                className={cx("modal__group__button__kick")}
                disabled={decisionLoading}
              >
                Kick
              </button>
            )}

          {/* )} */}
        </div>
      )}
    </div>
  );
}

export default GroupInvited;
