
import { Avatar } from "@mui/material";
import classNames from 'classnames/bind';
import React from "react";
import styles from "./Chats.scss";


const cx = classNames.bind(styles)

function Chats() {
    return (
        <div className={cx("chats")} >
            {/* {notifications.map((n) => displayNotification(n))} */}
            <div className={cx("chats__title")}>
                <span >duongw</span>
            </div>
            <div className={cx("chats__input")}>
                <input type="text"  placeholder="Search"/>
            </div>
            <div className={cx("chats__messages")}>
                Messages
            </div>
            <div className={cx("chats__content")} >
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
                <div className={cx("chats__user")}>
                    <span className={cx("chats__user_avatar")}>
                        <Avatar>R</Avatar>
                    </span>
                    <div className={cx("chats__user__info")}>
                        <span className={cx("chats__username")}>redian_</span>
                        <span className={cx("chats__relation")}>New to Instagram</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Chats;