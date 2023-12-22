import React, { useState, forwardRef } from "react";
import classNames from "classnames/bind";
import styles from "./GroupItem.module.scss";
import { useNavigate } from "react-router-dom";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import {
  requestToGroup,
  deleteToGroup,
  acceptToGroup,
} from "../../services/groupService";

const cx = classNames.bind(styles);

const GroupItem = ({ group }) => {
  const privateHttpRequest = usePrivateHttpClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(group.status);
  const handleRequestToGroup = async () => {
    setLoading(true);
    try {
      const respone = await requestToGroup(
        group._id,
        privateHttpRequest.privateRequest
      );
      if (respone !== null) {
        setLoading(false);
        setStatus("REQUESTED");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDeleteToGroup = async () => {
    setLoading(true);
    try {
      const respone = await deleteToGroup(
        group._id,
        privateHttpRequest.privateRequest
      );
      if (respone !== null) {
        setStatus(null);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAcceptToGroup = async () => {
    setLoading(true);
    try {
      const respone = await acceptToGroup(
        group._id,
        privateHttpRequest.privateRequest
      );
      if (respone !== null) {
        setStatus("MEMBER");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleButton = async () => {
    if (!loading) {
      if (status) {
        if (status === "ADMIN" || status === "MEMBER") {
          navigate(`/g/${group._id}/`, { replace: true });
        } else if (status === "REQUESTED") {
          handleDeleteToGroup();
        }
      } else {
        handleRequestToGroup();
      }
    }
  };

  return (
    <>
      <div className={cx("group__info")}>
        <div className={cx("group__inf")}>
          <div className={cx("group__avatar")}>
            <img src={group.cover} />
          </div>

          <span>{group.name}</span>
        </div>
        {status === "INVITED" ? (
          <div
            className={cx("group__btn")}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button
              className={cx("accept__button")}
              onClick={handleAcceptToGroup}
            >
              <span>Accept</span>
            </button>
            <button
              style={{ width: "47%" }}
              className={cx("join__button")}
              onClick={handleDeleteToGroup}
            >
              <span>Reject</span>
            </button>
          </div>
        ) : (
          <div className={cx("group__btn")}>
            <button className={cx("join__button")} onClick={handleButton}>
              {(!status && <span>Join group</span>) ||
                (status === null && <span>Join group</span>) ||
                (status === "ADMIN" && <span>View group</span>) ||
                (status === "MEMBER" && <span>View group</span>) ||
                (status === "REQUESTED" && <span>Cancel Request</span>)}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GroupItem;
