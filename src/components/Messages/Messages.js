import React, { useContext, useEffect, useState, useRef } from "react";
// import { ChatContext } from "../context/ChatContext";
// import { db } from "../firebase";
// import { doc, onSnapshot } from "firebase/firestore";
import Message from "../Message";
import style from "./Messages.module.scss";
import classNames from "classnames/bind";
import * as messageService from "../../services/messageService";
import { StateContext } from "../../context/StateContext";
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

const cx = classNames.bind(style);


function Messages({ style }) {
  const { messages, currentChat, socket, isLoadingMsg, dispatch } = useContext(StateContext);
  const [fetching, setFetching] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const socketEventRef = useRef(false);
  const checkCurrentChatIdRef = useRef(null);
  const scrollRef = useRef(null);
  const firstChat = useRef(null);

  useEffect(() => {
    
    const handleScroll = async () => {
      if(!firstChat.current){
        const scrollTop = scrollRef.current.scrollTop;
        if (scrollTop === 0) {
          console.log('Đã đạt đến đầu trang' + messages.length );
          try{
            setLoadMore(true);
            const data = await messageService.getMessages(currentChat._id, messages.length);
            console.log('data' + data );
            dispatch({ type: "LOAD_MORE_MESSAGES", payload: data, fromSelf: true, });
          }catch(error){
            setLoadMore(false);
            console.log("Lỗi:", error)
          }finally{
            setLoadMore(false);
          }
        }
      }else{
        firstChat.current=false
      }
      
    };
    
    if(scrollRef.current){
      scrollRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll);
      }
    };
    
  }, [messages]);


  useEffect(() => {
    // console.log(socket, currentChat._id);
    // console.log(checkCurrentChatIdRef.current);
    if(socket){
      // console.log("toi socket");
      if (socket.current && !socketEventRef.current) {
        socket.current.on("msg-recieve", (data) => handleMsgRecieve(checkCurrentChatIdRef.current, data));
        socketEventRef.current = true;
      }
    }
  }, [currentChat, socket.current]);

  const handleMsgRecieve = (c,data) => {
    console.log(data);
    console.log(c);
    if ( c ){
      if(data.conversationId === c){
        console.log("toi day chua" + c);
        dispatch({
            type: "ADD_MESSAGE",
            payload: data
        });
      }
    }
  };

  useEffect(() => {
    setFetching(true);
    // console.log("day" + fetching + isLoadingMsg);
    // console.log("Current_Chat",currentChat._id);
    // console.log("messages",messages);
    const fetchData = async () => {
      try {
        // console.log("Current_Chat",currentChat._id);
        const data = await messageService.getMessages(currentChat._id, 0);
        dispatch({ type: "SET_MESSAGES", payload: data });
        firstChat.current = true;
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
    // console.log(currentChat);
    checkCurrentChatIdRef.current = currentChat._id;
  },[currentChat]);

  return (
    <div className={cx("messages")} style={style} ref={scrollRef}>
      <div style={{justifyContent: "center", display:"flex"}}>
        {loadMore ? (<DonutLargeIcon className={loadMore? cx("loading-icon") : null} style={{color: "#A8A8A8", marginTop: "10px"}}/>) : null}
      </div>
      {messages && messages.map((m) => {
        if (m.content || m.media) {
          return <Message message={m} key={m._id} />;
        }
        return null; // Không hiển thị tin nhắn khi cả content và media đều không có giá trị    
      })}
    </div>
  );
}

export default Messages;
