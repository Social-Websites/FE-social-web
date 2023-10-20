import React, { useContext, useEffect, useState } from "react";
// import { ChatContext } from "../context/ChatContext";
// import { db } from "../firebase";
// import { doc, onSnapshot } from "firebase/firestore";
import Message from "../Message";
import style from "./Messages.module.scss"
import classNames from 'classnames/bind';

const cx = classNames.bind(style)

function Messages () {
const [messages, setMessages] = useState([{text: "sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss"},{text: "hello"},{text: "hello"}
,{text: "hello"},{text: "hello"},{text: "hello"},{text: "hello"},{text: "hello"},{text: "hello"},{text: "hello"},{text: "hello"}]);
//   const { data } = useContext(ChatContext);

//   useEffect(() => {
//     const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
//       doc.exists() && setMessages(doc.data().messages);
//     });

//     return () => {
//       unSub();
//     };
//   }, [data.chatId]);

//   console.log(messages)

  return (
    <div className={cx("messages")}>
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;