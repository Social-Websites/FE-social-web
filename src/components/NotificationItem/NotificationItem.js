import React from "react";
import style from "./NotificationItem.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(style);
function NotificationItem({n}) {
return (

    <div className={cx("open__user")}>
        <div className={cx("open__user_avatar")}>
            <img
                style={{width: "44px",height: "44px"}}
                src={n.img}
                alt=""
            />
        </div>
        <div style={{display: "flex", alignItems: "center"}}>
            <div className={cx("open__user__info")}>
                <a className={cx("open__username")}>{n.senderName}</a>
                <span className={cx("open__relation")}>{n.content}</span>
            </div>
        </div>
    </div>
)
}
export default NotificationItem;