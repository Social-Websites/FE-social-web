import React, { useContext, useEffect, useRef } from "react";
import style from "./Message.module.scss"

function Message({ message }) {
//   const { currentUser } = useContext(AuthContext);
//   const { data } = useContext(ChatContext);

//   const ref = useRef();

//   useEffect(() => {
//     ref.current?.scrollIntoView({ behavior: "smooth" });
//   }, [message]);

  return (
    <div
    //   ref={ref}
    //   className={`message ${message.senderId === currentUser.uid && "owner"}`}
      className={`message owner`}
    >
      <div className="messageInfo">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN-sWjSJJHyK65RzMLdZFVWDA2W2GH8Nbb8_bfkHBzEPrZ2VweYb0d9kfjLKTw786q6EA&usqp=CAU"
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;