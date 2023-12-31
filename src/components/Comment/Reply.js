import {
  React,
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useContext,
} from "react";
//import styles from "../Post/Post.scss";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
//import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import TimeAgo from "../../shared/components/TimeAgo";
import { grey } from "@mui/material/colors";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { deletePostComment } from "../../services/postServices";
import { StateContext } from "../../context/StateContext";
import renderMentionLink from "../../shared/util/renderMentionLink";

//const cx = classNames.bind(styles);

const Comment = forwardRef((props, ref) => {
  const { dispatch } = useContext(StateContext);
  const { user } = useAuth();
  const privateHttpRequest = usePrivateHttpClient();

  const [deleteCmt, setDeleteCmt] = useState(false);

  const toggleDeleteCmt = () => {
    if (props.more) props.toggleMore();
    setDeleteCmt(!deleteCmt);
    if (!deleteCmt) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      if (!props.modal) document.body.style.overflow = "auto";
    }
  };

  const handleDeletePostComment = async () => {
    if (!props.reportLoading) {
      try {
        props.setReportLoading(true);
        const response = await deletePostComment(
          props.comment._id,
          privateHttpRequest.privateRequest
        );
        if (response.message) {
          props.deleteReplyComment(props.parent._id, props.comment._id);
          if (deleteCmt) toggleDeleteCmt();
          props.setReportLoading(false);
          props.setSnackBarNotif({
            severity: "success",
            message: "Delete comment success!",
          });
          props.setSnackBarOpen(true);
        }
      } catch (err) {
        props.setReportLoading(false);
        props.setSnackBarNotif({
          severity: "error",
          message: "Delete comment fail: " + err,
        });
        props.setSnackBarOpen(true);
      }
    }
  };

  return (
    <>
      <div
        key={props.comment._id}
        className={props.cx("post-comment-user")}
        style={{ marginLeft: "30px", width: "77%" }}
      >
        <div className={props.cx("post-comment-user-avatar")}>
          <Link
            to={`/${props.comment.user.username}/`}
            className={props.cx("post-comment-user-avatar")}
            style={{
              position: "inherit",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              style={{ width: "30px", height: "30px" }}
              src={getAvatarUrl(props.comment.user.profile_picture)}
              alt=""
            />
          </Link>
        </div>
        <div>
          <div className={props.cx("post-comment-user-info")}>
            <Link
              to={`/${props.comment.user.username}/`}
              style={{
                position: "inherit",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span className={props.cx("post-comment-username")}>
                {props.comment.user.username}
              </span>
            </Link>
            <span className={props.cx("post-comment-content")}>
              {renderMentionLink(props.comment.comment)}
            </span>
          </div>
          {ref ? (
            <div
              ref={ref}
              style={{
                display: "flex",
                alignItems: "center",
                height: "18px",
              }}
            >
              <span
                style={{
                  color: "#A8A8A8",
                  fontSize: "12px",
                  marginRight: "12px",
                  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                  Helvetica, Arial, sans-serif`,
                  fontWeight: 500,
                }}
              >
                <TimeAgo
                  type="admin-short"
                  created_at={props.comment.created_at}
                />
              </span>
              <span
                style={{
                  cursor: "pointer",
                  color: "#A8A8A8",
                  fontSize: "12px",
                  marginRight: "12px",
                  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                  Helvetica, Arial, sans-serif`,
                  fontWeight: 500,
                }}
                onClick={() => {
                  props.setReplyCommentId(props.comment._id);
                  props.setIsReply(true);
                  props.setInitialText(`@${props.comment.user.username} `);
                  props.inputRef.current.focus();
                }}
              >
                Reply
              </span>
              {(props.comment.user._id === user._id ||
                props.post.creator._id === user._id) && (
                <MoreHorizIcon
                  className={props.cx("moreCmt")}
                  style={{ color: "white", marginTop: "6px" }}
                  onClick={toggleDeleteCmt}
                />
              )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "18px",
              }}
            >
              <span
                style={{
                  color: "#A8A8A8",
                  fontSize: "12px",
                  marginRight: "12px",
                  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                  Helvetica, Arial, sans-serif`,
                  fontWeight: 500,
                }}
              >
                <TimeAgo
                  type="admin-short"
                  created_at={props.comment.created_at}
                />
              </span>
              <span
                style={{
                  cursor: "pointer",
                  color: "#A8A8A8",
                  fontSize: "12px",
                  marginRight: "12px",
                  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                  Helvetica, Arial, sans-serif`,
                  fontWeight: 500,
                }}
                onClick={() => {
                  props.setReplyCommentId(props.comment._id);
                  props.setIsReply(true);
                  props.setInitialText(`@${props.comment.user.username} `);
                  props.inputRef.current.focus();
                }}
              >
                Reply
              </span>
              {(props.comment.user._id === user._id ||
                props.post.creator._id === user._id) && (
                <MoreHorizIcon
                  className={props.cx("moreCmt")}
                  style={{ color: "white", marginTop: "6px" }}
                  onClick={toggleDeleteCmt}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {deleteCmt && (
        <div className={props.cx("post-modal active-post-modal")}>
          <div
            onClick={toggleDeleteCmt}
            className={props.cx("post-overlay")}
            style={{ alignSelf: "flex-end" }}
          >
            <CloseIcon
              className={props.cx("sidenav__icon")}
              style={{
                width: "27px",
                height: "27px",
                color: "white",
                margin: "12px 30px",
                position: "absolute",
                right: "0",
                cursor: "pointer",
              }}
            />
          </div>
          <div className={props.cx("more-content")}>
            <div
              className={props.cx("more-content-element")}
              style={{ color: "#ed4956" }}
              onClick={handleDeletePostComment}
            >
              Delete
            </div>
            <div
              className={props.cx("more-content-element")}
              onClick={toggleDeleteCmt}
            >
              Cancel
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default Comment;
