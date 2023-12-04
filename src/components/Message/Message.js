import React, { useContext, useEffect, useRef } from "react";
import style from "./Message.module.scss"
import classNames from 'classnames/bind';
import { StateContext } from "../../context/StateContext"


const cx = classNames.bind(style)

function Message({ message }) {

  const { user } = useContext(StateContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);


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
      
      <div className={cx("messageContent")}>
        {message.content? (<p>{message.content}</p>):null}
        
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
      </div>
    </div>
  );
};

export default Message;