import classNames from 'classnames/bind';
import {React, useState, useEffect, useRef} from "react";
import styles from "./ConversationChat.module.scss";
import { useContext } from 'react';
import { StateContext } from "../../../context/StateContext";
import * as messageService from '../../../services/messageService';

const cx = classNames.bind(styles)

function ConversationChat({c, onClick}) {
    const [hasNotification, setHasNotification] = useState("");
    const { user, socket, messages, currentChat ,dispatch } = useContext(StateContext);
    const [ unread , setUnread] = useState(false);
    const [ isOnline , setIsOnline] = useState(false);
    const socketEventRef = useRef(false);


    useEffect(() => {
        setUnread(c.unread)
    }, []);

    useEffect(() => {
        if(socket){
            setIsOnline(c.online);
            socket.current.on("getOnlineUser", (data) => {
                console.log(data)
                if(c.userIds == data.user_id){
                    setIsOnline(true);
                }
            });
        }
    }, [socket?.current]);

    useEffect(() => {
        if(socket){
            setIsOnline(c.online);
            socket.current.on("getOfflineUser", (data) => {
                console.log(data)
                if(c.userIds == data.user_id){
                    setIsOnline(false);
                }
            });
        }
    }, [socket?.current]);


    useEffect(() => {
        console.log(socket);
        if(socket){
            console.log("toi socket");
            if (socket.current && !socketEventRef.current) {
                socket.current.on("msg-recieve", handleMsgRecieve);
                socketEventRef.current = true;
            }
        }
    }, [socket.current]);

    const handleMsgRecieve = (data) => {
        if ( data.conversationId == c._id) {
            if (data.media.length > 0) setHasNotification("Image");
            else setHasNotification(data.content);
            setUnread(true);
        }
    };
    

    useEffect(() => {
        console.log(currentChat);
        if(messages && messages.length > 0){
            if(c._id == messages[messages.length - 1].conversationId){
                if(user._id == messages[messages.length - 1].sender_id){
                    if(messages[messages.length - 1].media.length > 0) {setHasNotification("You: Image");}
                    else { setHasNotification(`You: ${messages[messages.length - 1].content}`);}
                }
            }
            
        }
        if(currentChat){
            if(currentChat._id === c._id){
                const data = {
                    conversation_id: c._id,
                    reader_id: user._id,
                }
                if(unread){
                    (async () =>{
                        try{
                            const result = await messageService.addReader(data);
                            if (result !== null) {
                                setUnread(false);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    })()
                }
            }
        }
    }, [messages]);
    

    return (
        <div className={cx("chats__user")} onClick={onClick}>
            <div className={cx("chats__user_avatar")}>
                <img
                    style={{width: "44px",height: "44px"}}
                    src={c.img === ""
                    ? "/static-resources/default-avatar.jpg"
                    : c.img}
                    alt=""
                />
                {isOnline ? (<span></span>):null}
                
            </div>

            {unread ? (<div className={cx("chats__user__info")}>
                <span className={cx("chats__username")} style={{fontWeight: 700}}>{c.name}</span>
                {hasNotification?(<span className={cx("chats__relation")} style={{fontWeight: 600, color:"white"}}>{hasNotification}</span>) : 
                (<span className={cx("chats__relation")}>{c.lastMsg}</span>)}
                
            </div>)
            :(<div className={cx("chats__user__info")}>
                <span className={cx("chats__username")}>{c.name}</span>
                {hasNotification?(<span className={cx("chats__relation")}>{hasNotification}</span>) : 
                (<span className={cx("chats__relation")}>{c.lastMsg}</span>)}
            </div>)}
            
            {unread ? (<div className={cx("unread__info")}>
                <span className={cx("unread")}></span>
            </div>): null}
        </div>
    )
}

export default ConversationChat;