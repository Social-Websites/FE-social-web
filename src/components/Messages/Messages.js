import React, { useContext, useEffect, useState } from "react";
// import { ChatContext } from "../context/ChatContext";
// import { db } from "../firebase";
// import { doc, onSnapshot } from "firebase/firestore";
import Message from "../Message";
import style from "./Messages.module.scss";
import classNames from "classnames/bind";
import * as messageService from "../../services/messageService";
import { StateContext } from "../../context/StateContext";

const cx = classNames.bind(style);


function Messages({ style }) {
  const { messages, currentChat, isLoadingMsg, dispatch } = useContext(StateContext);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
    console.log("day" + fetching +isLoadingMsg);
    const fetchData = async () => {
      try {
        if(messages){
          const data = await messageService.getMessages(currentChat._id);
          dispatch({ type: "SET_MESSAGES", payload: data });
        }
      } catch (error) {
        console.log(error);
        setFetching(false);
      } finally {
        dispatch({ type: "IS_LOADING_MESSAGES", payload: false });
        setFetching(false);
      }
    };
    if (currentChat && fetching === true && isLoadingMsg) {
      fetchData();
    }
  }, [currentChat, fetching]);

  useEffect(() => {
    console.log(currentChat);
  }, [currentChat, fetching]);


  return (
    <div className={cx("messages")} style={style}>
      {messages.map((m) => {
        if (m.content || m.media) {
          return <Message message={m} key={m.id} />;
        }
        return null; // Không hiển thị tin nhắn khi cả content và media đều không có giá trị    
      })}
    </div>
  );
}

export default Messages;
