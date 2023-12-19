import classNames from "classnames/bind";
import { React, useState, useEffect, useContext, forwardRef } from "react";
import styles from "./GroupInvited.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { CircularProgress } from "@mui/material";
import { StateContext } from "../../context/StateContext";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);
function GroupInvited({ group }) {
    return (
        <div className={cx("modal__group")}>
            <div style={{
                display: "flex",
                alignItems: "center"
            }}>
                <Link
                    // to={`/${props.groupId}`}
                    className={cx("modal__group_avatar")}
                    style={{
                        position: "inherit",
                        textDecoration: "none",
                        color: "inherit",
                }}
                >
                <img
                    style={{ width: "44px", height: "44px" }}
                    src={getAvatarUrl(group.groupImage)}
                    alt=""
                />
                </Link>
            </div>
            <div className={cx("modal__group__info")}>
                <Link
                    // to={`/${props.groupId}`}
                    style={{
                        position: "inherit",
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    <span className={cx("modal__group__username")}>
                        {group.name}
                    </span>
                </Link>
                {/* <span className={cx("modal__group__relation")}>
                    {props.item.full_name}
                </span> */}
            </div>
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
                    <CheckIcon />
                    </button>
                    <button
                    // onClick={handleReject}
                    className={cx("modal__group__button")}
                    // disabled={decisionLoading}
                    >
                    <ClearIcon />
                    </button>
                </>
                {/* )} */}
            </div>
        </div>
    );
}

export default GroupInvited;