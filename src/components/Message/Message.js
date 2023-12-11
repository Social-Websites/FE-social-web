import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./Message.module.scss"
import classNames from 'classnames/bind';
import { StateContext } from "../../context/StateContext"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import * as messageService from "../../services/messageService"

const cx = classNames.bind(style)

function Message({ message }) {

  const { user, socket, messageRemoves, currentChat, dispatch } = useContext(StateContext);
  const [more, setMore] = useState(false);
  const ref = useRef();

  const toggleMore = () => {
    setMore(!more);
    if (!more) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);


  useEffect(() => {
    // console.log("id_last", messageRemoves);
  }, [messageRemoves]);

  const handleUnsent = async () => {
    console.log("id", message._id);
    try{
      const data = {
        messageId: message._id,
        conversationId: currentChat._id,
        recieve_ids: currentChat.userIds,
      }
      if(message._id){
        console.log(currentChat);
        const result = await messageService.deleteMsg(data);
        socket.current.emit("delete-msg", data);
        dispatch({type: "UPDATE_MESSAGE_REMOVED", payload: message._id,
          fromSelf: true,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      toggleMore();
    }
  }


  return (
    
    <div
      ref={ref}
      className={message.sender_id === user._id ? cx("you") : cx("message") }
    >
      {message.sender_id === user._id ? null : (
        <div className={cx("messageInfo")}>
          <img
            src={message.img === ""
            ? "/static-resources/default-avatar.jpg"
            : message.img}
            alt=""
          />
        </div>
      )}
      
      {message.sender_id === user._id && ((message.removed === false && messageRemoves.includes(message._id) === false && (
        <div className={cx("moreMsg")} >
          <MoreHorizIcon style={{color: "white"}} onClick={toggleMore}/>
        </div>
      )))}
      {message.removed === true || messageRemoves.includes(message._id) === true ? (<div className={cx("remove")}>
        <p> 
          Tin nhắn đã được thu hồi
        </p>
      </div>) : (<div className={cx("messageContent")}>
        {message.content? (<p>{message.content} {message.removed}</p>):null}
        
        {message.media && 
          message.media.map(((m) => (
            <img src={m} alt="" style={{
              width: "100%",
              borderRadius: "10px",
              maxHeight:"300px",
              border: "#212121 solid 1px",
            }} />
          )))
        }
      </div>)}
      
      

      {more && (
        <div className={cx("message-modal active-message-modal")}>
          <div
            onClick={toggleMore}
            className={cx("message-overlay")}
            style={{ alignSelf: "flex-end" }}
          >
            <CloseIcon
              className={cx("sidenav__icon")}
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
          <div className={cx("more-content")}>
            <div
              className={cx("more-content-element")}
              style={{ color: "#ed4956" }}
              onClick={handleUnsent}
            >
              Unsent
            </div>
            <div className={cx("more-content-element")} onClick={toggleMore}>Cancel</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;