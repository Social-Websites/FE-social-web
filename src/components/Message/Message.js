import React, { useContext, useEffect, useRef } from "react";
import style from "./Message.module.scss"
import classNames from 'classnames/bind';


const cx = classNames.bind(style)

function Message({ message }) {
  const uId="6537933675b948b32d19d38c";

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);


  return (
    <div
      ref={ref}
      className={message.sender_id === uId ? cx("you") : cx("message") }
    >
      {message.sender_id === uId ? null : (
        <div className={cx("messageInfo")}>
          <img
            src={message.img}
            alt=""
          />
        </div>
      )}
      
      <div className={cx("messageContent")}>
        <p>{message.content}</p>
        {/* {message.img && <img src={message.img} alt="" />} */}
      </div>
    </div>
  );
};

export default Message;