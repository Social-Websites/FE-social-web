import classNames from "classnames/bind";
import { React } from "react";
import styles from "./Setting.module.scss";

const cx = classNames.bind(styles);
const Setting = () => {
  return (
    <div className={cx("settings")}>
      {/* {notifications.map((n) => displayNotification(n))} */}
      <div className={cx("settings__title")}>
        <span>Settings</span>
      </div>
      <div className={cx("settings__content")}>
        <div className={cx("settings__content__element")}>Edit profile</div>
        <div className={cx("settings__content__element")}>Personal details</div>
        <div className={cx("settings__content__element")}>Change password</div>
        <div className={cx("settings__content__element")}>
          Push notifications
        </div>
      </div>
    </div>
  );
};
export default Setting;
