import { Avatar } from "@mui/material";
import React from "react";
import classNames from 'classnames/bind';
import styles from "./Suggestions.scss";

const cx = classNames.bind(styles)

function Suggestions() {
  return (
    <div className={cx("suggestions")}>
      <div className={cx("suggestions__title")}>Suggestions for you</div>
      <div className={cx("suggestions__usernames")}>
        <div className={cx("suggestions__username")}>
          <div className={cx("username__left")}>
            <span className={cx("avatar")}>
              <Avatar style={{ position: "inherit" }}>R</Avatar>
            </span>
            <div className={cx("username__info")}>
              <span className={cx("username")}>redian_</span>
              <span className={cx("relation")}>New to Instagram</span>
            </div>
          </div>
          <button className={cx("follow__button")}>Follow</button>
        </div>

        <div className={cx("suggestions__username")}>
          <div className={cx("username__left")}>
            <span className={cx("avatar")}>
              <Avatar style={{ position: "inherit" }}>R</Avatar>
            </span>
            <div className={cx("username__info")}>
              <span className={cx("username")}>redian_</span>
              <span className={cx("relation")}>New to Instagram</span>
            </div>
          </div>
          <button className={cx("follow__button")}>Follow</button>
        </div>

        <div className={cx("suggestions__username")}>
          <div className={cx("username__left")}>
            <span className={cx("avatar")}>
              <Avatar style={{ position: "inherit" }}>R</Avatar>
            </span>
            <div className={cx("username__info")}>
              <span className={cx("username")}>redian_</span>
              <span className={cx("relation")}>New to Instagram</span>
            </div>
          </div>
          <button className={cx("follow__button")}>Follow</button>
        </div>

        <div className={cx("suggestions__username")}>
          <div className={cx("username__left")}>
            <span className={cx("avatar")}>
              <Avatar style={{ position: "inherit" }}>R</Avatar>
            </span>
            <div className={cx("username__info")}>
              <span className={cx("username")}>redian_</span>
              <span className={cx("relation")}>New to Instagram</span>
            </div>
          </div>
          <button className={cx("follow__button")}>Follow</button>
        </div>
      </div>
    </div>
  );
}

export default Suggestions;