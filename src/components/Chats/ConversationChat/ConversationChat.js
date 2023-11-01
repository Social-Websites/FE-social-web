import classNames from 'classnames/bind';
import {React } from "react";
import styles from "./ConversationChat.module.scss";
import { useContext } from 'react';
import { StateContext } from "../../../context/StateContext";


const cx = classNames.bind(styles)

function ConversationChat({c}) {
    const { dispatch } = useContext(StateContext);

    const handleClick = () => {
        dispatch({ type: "CURRENT_CHAT", payload: c });
    };
    

    return (
        <div className={cx("chats__user")} onClick={handleClick}>
                    <span className={cx("chats__user_avatar")}>
                        <img
                            style={{width: "44px",height: "44px"}}
                            src={c.img}
                            alt=""
                        />
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>{c.name}</span>
                        <span className={cx("chats__relation")}>{c.lastMsg}</span>
                    </div>
                </div>
    )
}

export default ConversationChat;