import React, {useContext, useEffect, useRef, useState, useLayoutEffect} from "react";
import classNames from 'classnames/bind';
import styles from "./ChatPage.scss";
import Sidenav from "../../shared/components/NavBar";
import Chats from "../../components/Chats";
import Messages from "../../components/Messages";
import Input from "../../components/InputMessage";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from "@mui/icons-material/Close";
import { StateContext } from "../../context/StateContext"
import {calculatedTime} from "../../shared/util/calculatedTime"
// import {io} from "socket.io-client";
import * as conversationService from '../../services/conversationService';

const cx = classNames.bind(styles);

function ChatPage() {
    const { user, currentChat, isLoadingMsg, socket, dispatch } = useContext(StateContext);
    // const socket = useRef();
    const [ isOnline , setIsOnline] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const [remainingHeight, setRemainingHeight] = useState(619);
    const [isSelectedFile, setIsSelectedFile] = useState(0);

    const [more, setMore] = useState(false);

    const handleIsSelectedFile = (height) => {
        setIsSelectedFile(height);
    };
    
    useLayoutEffect(() => {
        setTimeout(() => {
            if (containerRef.current && inputRef.current) {
                const containerHeight = containerRef.current?.clientHeight || 0
                // console.log(containerRef.current.clientHeight)
                const inputHeight = inputRef.current?.clientHeight || 66;
                // console.log(inputRef.current.clientHeight)
                const chatInfoHeight = document.getElementById("chatInfo")?.clientHeight || 75;
                // console.log(chatInfoHeight)
                let remainingHeight;
                remainingHeight = containerHeight - inputHeight - chatInfoHeight - 30 ; //-padding messages + bottom:10px
                setRemainingHeight(remainingHeight);
            }
    }, 0);
    }, [inputRef.current, isSelectedFile]);
    
    // useEffect(()=>{
    //     if(user){
    //         if(socket.current == null){
    //             socket.current = io("http://localhost:5000");
    //             console.log(socket);
    //             socket.current.on("connect", () => {  // yêu cầu kết nối vào 1 socket mới
    //                 console.log(
    //                     `You connected with socket`,
    //                     Date().split("G")[0]
    //                 );
    //             }); // sự kiện mở kết nối socket
    //             socket.current.emit("add-user", user._id);
    //             dispatch({type: "SET_SOCKET", payload: socket});
    //         }
    //     }
    // }, [user]);


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
        setIsOnline(currentChat?.online);
        // console.log("online chua");
        // console.log(currentChat?.online);
        if(currentChat){
            console.log("online chua");
            socket.current.on("getOnlineUser", (data) => {
                // console.log(data)
                if(currentChat.userIds.includes(data.user_id) && data.user_id != user._id){
                    setIsOnline(true);
                }
            });
        }
        console.log(currentChat?.last_online);
    }, [socket?.current, currentChat]);

    useEffect(() => {
        setIsOnline(currentChat?.online);
        // console.log("offline chua");
        // console.log(currentChat?.online);
        if(currentChat){
            socket.current.on("getOfflineUser", (data) => {
                // console.log(data)
                if(currentChat.userIds.includes(data.user_id)){
                    setIsOnline(false);
                }
            });
        }
    }, [socket?.current, currentChat]);


    // useEffect(() => {
    //     console.log(currentChat);
    // },[currentChat]);

    const handleDelete = async () =>{
        console.log("xoa ne" + currentChat._id )
        try{
            const data = {
                userId: user._id,
                conversationId: currentChat._id
            }
            await conversationService.deleteConversation(data)
        } catch (error){
            console.log(error);
        } finally{
            dispatch({ type: "DELETE_CONVERSATION", payload: currentChat });
            dispatch({ type: "CURRENT_CHAT", payload: null });
            toggleMore();
        } 
    }
    
    return (
        <div className={cx("chatpage")}>
            <div className={cx("chatpage__navWraper")}>
                <Sidenav />
            </div>
            <div className={cx("chatpage__sideBar")}>
                <Chats />
            </div>
            
            {currentChat?  
            ( <div className={cx("chatpage__messages")} ref={containerRef}> 
            {!isLoadingMsg? (
            <div className={cx("chatInfo")} id="chatInfo">
                <div className={cx("chatInfo__user")}>
                    <div className={cx("chatInfo__user_avatar")}>
                        <img
                            style={{width: "44px",height: "44px"}}
                            src={currentChat?.img  === ""
                            ? "/static-resources/default-avatar.jpg"
                            : currentChat?.img}
                            alt=""
                        />
                        {isOnline ? (<span></span>):null}
                    </div>
                    <div className={cx("chatInfo__user__info")}>
                        <span className={cx("chatInfo__username")}>{currentChat?.name}</span>
                        <span className={cx("chatInfo__relation")}>{isOnline ? ("Active Now") : ("Active " + calculatedTime(currentChat.last_online) + " ago")}</span>
                    </div>
                </div>
                <div>
                    <ErrorOutlineIcon style={{color: "white", cursor: "pointer"}} onClick={toggleMore}/>
                </div>
            </div>): (<div className={cx("chatpage__messages__main")}>
                <div>
                    <div className={cx("chatpage__messages__image")}>
                      <ChatOutlinedIcon className={cx("skeleton chatpage__messages__logo ")} />
                    </div>
                    <div className={cx("chatpage__messages__text")}> <span className={cx("skeleton")}>Your Messages</span></div>
                    <div className={cx("chatpage__messages__text")}> <span className={cx("skeleton")} style={{color: "#A8A8A8", fontSize: "14px"}} >Send private photos and messages to a friend or group</span></div>
                </div>
            </div>)}
            
            <Messages style={isLoadingMsg? {display: "none"} : {height: remainingHeight}}/>
            <div ref={inputRef} style={isLoadingMsg? {display: "none"} : null} >
                <Input onSelectedFile={handleIsSelectedFile} />
            </div>
            </div>) : (<div className={cx("chatpage__messages")}>
                <div className={cx("chatpage__messages__main")}>
                    <div>
                        <div className={cx("chatpage__messages__image")}>
                        <ChatOutlinedIcon className={cx("chatpage__messages__logo ")} />
                        </div>
                        <div className={cx("chatpage__messages__text")}> <span>Your Messages</span></div>
                        <div className={cx("chatpage__messages__text")}> <span style={{color: "#A8A8A8", fontSize: "14px"}} >Send private photos and messages to a friend or group</span></div>
                    </div>
                </div>
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
                        <div className={cx("more-content-header")}>
                            <div className={cx("more-content-title")}>Are you want delete this chat?</div>
                        </div>
                        <div className={cx("more-content-report")} style={{color: "#ed4956", fontWeight: "500"}}
                            onClick={handleDelete}>Delete</div>
                        <div className={cx("more-content-report")} onClick={toggleMore}>Cancel</div>
                    </div>
                </div>
            )}    
            
        </div>
    );
}

export default ChatPage;