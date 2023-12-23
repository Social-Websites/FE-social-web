import classNames from "classnames/bind";
import { React, useState, useEffect, useContext, forwardRef } from "react";
import styles from "./UserRequestGroup.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { CircularProgress } from "@mui/material";
import { StateContext } from "../../context/StateContext";
import { Link } from "react-router-dom";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import {
  acceptRequestToGroup,
  acceptToGroup,
  rejectRequestToGroup,
} from "../../services/groupService";

const cx = classNames.bind(styles);
function GroupInvited({ user, setUser, setGroupDetail, groupOwner, type }) {
  const authObj = useAuth();
  const privateHttpClient = usePrivateHttpClient();

  const [decisionLoading, setDecisionLoading] = useState(false);

  const handleAccept = async () => {
    try {
      setDecisionLoading(true);
      const response = await acceptRequestToGroup(
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
      console.error("reject ", err);
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
            {authObj.user._id === groupOwner._id ? "GROUP OWNER" : user.status}
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
        <div>
          {/* {props.decision === "ACCEPT" ? (
                <span style={{ color: "white" }}>Accepted</span>
                ) : props.decision === "REJECT" ? (
                <span style={{ color: "white" }}>Rejected</span>
                ) : ( */}

          <>
            <button
              // onClick={handleAccept}
              className={cx("modal__group__button__accept")}
              // disabled={decisionLoading}
            >
              Invite
            </button>
          </>
          {/* )} */}
        </div>
      ) : (
        <div>
          {/* {props.decision === "ACCEPT" ? (
                <span style={{ color: "white" }}>Accepted</span>
                ) : props.decision === "REJECT" ? (
                <span style={{ color: "white" }}>Rejected</span>
                ) : ( */}

          {authObj.user._id !== groupOwner._id &&
            user.status === "ADMIN" &&
            authObj.user._id !== user._id && (
              <button
                // onClick={handleAccept}
                className={cx("modal__group__button__kick")}
                // disabled={decisionLoading}
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
