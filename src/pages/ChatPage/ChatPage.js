import React, {useContext, useEffect, useRef, useState, useLayoutEffect} from "react";
import classNames from 'classnames/bind';
import styles from "./ChatPage.scss";
import Sidenav from "../../shared/components/NavBarMini";
import Chats from "../../components/Chats";
import Messages from "../../components/Messages";
import Input from "../../components/InputMessage";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { StateContext } from "../../context/StateContext"
import {io} from "socket.io-client";

const cx = classNames.bind(styles);

function ChatPage() {
    const { user, currentChat, dispatch } = useContext(StateContext);
    const socket = useRef();
    const [socketEvent, setSocketEvent] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const [remainingHeight, setRemainingHeight] = useState(0);
    const [isSelectedFile, setIsSelectedFile] = useState(0);

  const handleIsSelectedFile = (height) => {
    setIsSelectedFile(height);
  };
    
    useLayoutEffect(() => {
        setTimeout(() => {
            if (containerRef.current && inputRef.current) {
                const containerHeight = containerRef.current?.clientHeight || 0
                console.log(containerRef.current.clientHeight)
                const inputHeight = inputRef.current?.clientHeight || 0;
                console.log(inputRef.current.clientHeight)
                const chatInfoHeight = document.getElementById("chatInfo")?.clientHeight || 0;
                console.log(chatInfoHeight)
                let remainingHeight;
                remainingHeight = containerHeight - inputHeight - chatInfoHeight - 30 ; //-padding messages + bottom:10px
                setRemainingHeight(remainingHeight);
            }
    }, 0);
    }, [inputRef.current, isSelectedFile]);
    
    useEffect(()=>{
        if(user){
            socket.current = io("http://localhost:5000");
            console.log(socket);
            socket.current.on("connect", () => {  // yêu cầu kết nối vào 1 socket mới
                console.log(
                    `You connected with socket`,
                    Date().split("G")[0]
                  );
              }); // sự kiện mở kết nối socket
            socket.current.emit("add-user", user._id);
            dispatch({type: "SET_SOCKET", payload: socket});
        }
    }, [user])

    useEffect(()=>{
        if(socket.current && !socketEvent){
            socket.current.on("msg-recieve", (data)=>{
                console.log(data);
                dispatch({
                    type: "ADD_MESSAGE",
                    payload: data
                })
            })
            setSocketEvent(true)
        }
    }, [socket.current]);
    
    return (
        <div className={cx("chatpage")}>
            <div className={cx("chatpage__navWraper")}>
                <Sidenav />
            </div>
            <div className={cx("chatpage__sideBar")}>
                <Chats />
            </div>
            {currentChat?  
            (<div className={cx("chatpage__messages")} ref={containerRef}>
            <div className={cx("chatInfo")} id="chatInfo">
                <div className={cx("chatInfo__user")}>
                    <span className={cx("chatInfo__user_avatar")}>
                        <img
                            style={{width: "44px",height: "44px"}}
                            src={currentChat?.img}
                            alt=""
                        />
                    </span>
                    <div className={cx("chatInfo__user__info")}>
                        <span className={cx("chatInfo__username")}>{currentChat?.name}</span>
                        <span className={cx("chatInfo__relation")}>New to Instagram</span>
                    </div>
                </div>
            </div>
            
            <Messages style={{height: remainingHeight}}/>
            <div ref={inputRef}>
            <Input onSelectedFile={handleIsSelectedFile}/>
            </div>
        </div>) : (<div className={cx("chatpage__messages")}>
            <div className={cx("chatpage__messages__main")}>
                <div>
                    <div className={cx("chatpage__messages__image")}>
                      <ChatOutlinedIcon className={cx("chatpage__messages__logo")} />
                    </div>
                    <div className={cx("chatpage__messages__text")} >Drop photos and videos here</div>
                </div>
            </div>
        </div>)}
        
            
        </div>
    );
}

export default ChatPage;