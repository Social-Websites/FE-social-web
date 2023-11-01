import React, { useContext, useEffect, useState } from "react";
// import { ChatContext } from "../context/ChatContext";
// import { db } from "../firebase";
// import { doc, onSnapshot } from "firebase/firestore";
import Message from "../Message";
import style from "./Messages.module.scss"
import classNames from 'classnames/bind';
import * as messageService from '../../services/messageService';
import { StateContext } from "../../context/StateContext"

const cx = classNames.bind(style)

function Messages () {
  const { messages, currentChat, dispatch } = useContext(StateContext);

  
  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await messageService.getMessages(currentChat._id);
            dispatch({type: "SET_MESSAGES", payload: data})
        } catch (error) {
            console.error(error);
        }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className={cx("messages")}>
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;