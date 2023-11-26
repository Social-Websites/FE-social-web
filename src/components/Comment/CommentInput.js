import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { comment } from "../../services/postServices";
import { CircularProgress } from "@mui/material";


const CommentInput = (props) => {
  const privateHttpRequest = usePrivateHttpClient();

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
  const handleEmojiModal = () => {
    setEmojiPicker(!emojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setText((prevText) => (prevText += emoji.emoji));
  };

  const handleSendComment = async () => {
    try {
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
        setText("");
      }

      console.log("------ comment success!");
    } catch (err) {
      console.error("Error while post comment: ", err);
    }
  };

  const handleEnter = async (event) => {
    if (event.key === "Enter") {
      console.log("Enter .....");
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
        {props.emojiPickerPos === "right" ? (
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
            <input 
              type="text"
              placeholder="Add a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyUp={handleEnter}
            />
            {privateHttpRequest.isLoading ? (
              <CircularProgress size={15} />
            ) : (
              <button
                type="submit"
                style={{
                  color: "#0095f6",
                  background: "none",
                  border: "none",
                  marginRight: "5px",
                  fontSize: "14px",
                  fontWeight: "600",
                  opacity: text === "" ? 0.5 : 1,
                  cursor: text !== "" ? "pointer" : "default",
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
                style={{
                  color: "#0095f6",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  marginRight: "5px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
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
};

export default CommentInput;
