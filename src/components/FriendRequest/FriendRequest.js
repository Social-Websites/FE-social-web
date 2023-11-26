import classNames from 'classnames/bind';
import {React, useState, useEffect, useRef} from "react";
import styles from "./FriendRequest.module.scss";


const cx = classNames.bind(styles)

function FriendRequest() {
    return (
        <div className={cx("profile-modal__user")}>
            <div className={cx("profile-modal__user_avatar")}>
                <img
                    style={{width: "44px",height: "44px"}}
                    src="data:image/jpeg;base64,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"
                    alt=""
                />     
            </div>
            <div className={cx("profile-modal__user__info")}>
                <span className={cx("profile-modal__username")}>duongw</span>
                <span className={cx("profile-modal__relation")}>đây nề</span>
            </div>
            <div>
            <button className={cx("profile-modal__button__accept")}>
                <span>Accept</span>
            </button>
            <button className={cx("profile-modal__button")}>
                <span>Remove</span>
            </button>
            </div>
        </div>
    );
}

export default FriendRequest;