import classNames from 'classnames/bind';
import {React } from "react";
import styles from "./ConversationChat.module.scss";


const cx = classNames.bind(styles)

function ConversationChat({name, img, lastMsg}) {
    
    return (
        <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <img
                            style={{width: "44px",height: "44px"}}
                            src={img}
                            alt=""
                        />
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>{name}</span>
                        <span className={cx("chats__relation")}>{lastMsg}</span>
                    </div>
                </div>
    )
}

export default ConversationChat;