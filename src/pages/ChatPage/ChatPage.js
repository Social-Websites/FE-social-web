import React from "react";
import classNames from 'classnames/bind';
import styles from "./ChatPage.scss";
import Sidenav from "../../shared/components/NavBarMini";
import Chats from "../../components/Chats";
import Messages from "../../components/Messages";
import Input from "../../components/InputMessage";

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
                        <img
                            style={{width: "44px",height: "44px"}}
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN-sWjSJJHyK65RzMLdZFVWDA2W2GH8Nbb8_bfkHBzEPrZ2VweYb0d9kfjLKTw786q6EA&usqp=CAU"
                            alt=""
                        />
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