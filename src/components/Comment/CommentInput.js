import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  forwardRef,
} from "react";
import classNames from "classnames/bind";
import styles from "./CommentInput.scss";
import EmojiPicker from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { comment, replyComment } from "../../services/postServices";
import { CircularProgress } from "@mui/material";
import { StateContext } from "../../context/StateContext";

const cx = classNames.bind(styles);

const CommentInput = forwardRef((props, ref) => {
  const privateHttpRequest = usePrivateHttpClient();
  const { user, socket } = useContext(StateContext);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setEmojiPicker(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setText(props.initialText);
  }, [props.initialText, props.parentCommentId]);

  const handleEmojiModal = () => {
    setEmojiPicker(!emojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setText((prevText) => (prevText += emoji.emoji));
  };

  const handleSendComment = async () => {
    if (!privateHttpRequest.isLoading) {
      try {
        if (!props.isReply) {
          const response = await comment(
            props.postId,
            text,
            privateHttpRequest.privateRequest
          );
          if (response) {
            props.setComments((prevComments) => [
              response.comment,
              ...prevComments,
            ]);
            props.setReplyCommentId("");
            setText("");
            props.setInitialText("");
            socket.current.emit("sendNotification", {
              sender_id: user?._id,
              receiver_id: [props.userId],
              content_id: props.postId,
              group_id: props?.group,
              type: "comment",
            });
            if (!props.isReply) props.setIsReply(false);
          }
        } else if (props.parentCommentId.trim() !== "") {
          const response = await replyComment(
            props.postId,
            props.parentCommentId,
            text,
            privateHttpRequest.privateRequest
          );
          if (response) {
            props.addReplyComment(response.comment.parent._id, response.comment);
            props.setReplyCommentId("");
            setText("");
            props.setInitialText("");
            socket.current.emit("sendNotification", {
              sender_id: user?._id,
              receiver_id: [response.comment.parent.user],
              content_id: props.postId,
              group_id: props?.group,
              type: "reply",
            });
            if (!props.isReply) props.setIsReply(false);
          }
        }
      } catch (err) {
        console.error("Error while post comment: ", err);
      } 
    }
  };

  const handleEnter = async (event) => {
    if (event.key === "Enter") {
      await handleSendComment();
    }
  };
  return (
    <>
      <div
        style={{ display: "inline-block", position: "relative", width: "100%" }}
      >
        {emojiPicker && (
          <div style={{ position: "absolute", bottom: 0, right: 0 }}>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="dark"
              emojiStyle="native"
              searchDisabled={true}
              width={330}
              height={350}
            />
          </div>
        )}
      </div>
      <div
        style={{
          ...props.style,
          display: "flex",
        }}
        className={props.className}
        id="emoji-open"
        ref={emojiPickerRef}
      >
        {props.emojiPickerPos === "left" ? (
          <>
            <SentimentSatisfiedAltIcon
              type="submit"
              style={{
                color: "#A8A8A8",
                cursor: "pointer",
                width: "24px",
                height: "24px",
                marginRight: 10,
              }}
              onClick={handleEmojiModal}
            />
            {ref ? (
              <input
                ref={ref}
                type="text"
                placeholder="Add a comment..."
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                onKeyUp={handleEnter}
              />
            ) : (
              <input
                type="text"
                placeholder="Add a comment..."
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                onKeyUp={handleEnter}
              />
            )}
            {privateHttpRequest.isLoading ? (
              <CircularProgress size={15} />
            ) : (
              <button
                type="submit"
                className={cx("comment__button")}
                style={{
                  opacity: text === "" ? 0.5 : 1,
                  cursor: text !== "" ? "pointer" : "default",
                  color: text !== "" ? null : "#0095f6",
                }}
                disabled={text === ""}
                onClick={handleSendComment}
              >
                Post
              </button>
            )}
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Add a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyUp={handleEnter}
            />
            {privateHttpRequest.isLoading ? (
              <CircularProgress size={15} />
            ) : text ? (
              <button
                type="submit"
                className={cx("comment__button")}
                onClick={handleSendComment}
              >
                Post
              </button>
            ) : null}
            <SentimentSatisfiedAltIcon
              type="submit"
              style={{
                color: "#A8A8A8",
                cursor: "pointer",
                width: "16px",
                height: "16px",
              }}
              onClick={handleEmojiModal}
            />
          </>
        )}
      </div>
    </>
  );
});

export default CommentInput;
