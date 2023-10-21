import React from "react";
import classNames from 'classnames/bind';
import styles from "./ChatPage.scss";
import Sidenav from "../../shared/components/NavBarMini";
import Chats from "../../components/Chats";
import Messages from "../../components/Messages";
import Input from "../../components/InputMessage";
import { Avatar } from "@mui/material";

const cx = classNames.bind(styles);

function ChatPage() {
  return (
    <div className={cx("chatpage")}>
        <div className={cx("chatpage__navWraper")}>
            <Sidenav />
        </div>
        <div className={cx("chatpage__sideBar")}>
            <Chats />
        </div>
        <div className={cx("chatpage__messages")}>
            <div className={cx("chatInfo")}>
                <div className={cx("chatInfo__user")}>
                    <span className={cx("chatInfo__user_avatar")}>
                        <Avatar style={{width: "44px",height: "44px"}}>R</Avatar>
                    </span>
                    <div className={cx("chatInfo__user__info")}>
                        <span className={cx("chatInfo__username")}>redian_</span>
                        <span className={cx("chatInfo__relation")}>New to Instagram</span>
                    </div>
                </div>
            </div>
            
            <Messages />
            <Input style={{bottom: 0}}/>
        </div>
    </div>
  );
}

export default ChatPage;