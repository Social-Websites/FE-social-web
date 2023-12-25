import classNames from 'classnames/bind';
import React from "react";
import styles from "./PostLoading.module.scss";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles)

function PostLoading() {
  return (
    <div>
      <div className={cx("open__user")}>
          <span
              className={cx("open__user_avatar")}
              style={{width: "44px",
                height: "44px",borderRadius: "50%"}}
              >
          </span>  
          <div className={cx("open__user__info")}>
              <span className={cx("open__username")} >
               </span>
              <span className={cx("open__relation")}></span>
          </div>
      </div>
    </div>
  );
}

export default PostLoading;
