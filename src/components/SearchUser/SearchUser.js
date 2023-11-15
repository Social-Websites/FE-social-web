import classNames from 'classnames/bind';
import React from "react";
import styles from "./SearchUser.module.scss";


const cx = classNames.bind(styles)

function SearchUser({ u }) {
  return (
    <div className={cx("open__user")}>
        <img
            className={cx("open__user_avatar")}
            style={{borderRadius: "50%"}}
            src={u?.profile_picture}
            alt=""
        />  
        <div className={cx("open__user__info")}>
            <span className={cx("open__username")}>{u?.username}</span>
            <span className={cx("open__relation")}>{u?.full_name}</span>
        </div>
    </div>
  );
}

export default SearchUser;