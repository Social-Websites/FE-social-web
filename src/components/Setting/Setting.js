import classNames from "classnames/bind";
import { React } from "react";
import styles from "./Setting.module.scss";
import { useLocation, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
const Setting = () => {
  const locate = window.location.pathname;
  const navigate = useNavigate();
  return (
    <div className={cx("settings")}>
      {/* {notifications.map((n) => displayNotification(n))} */}
      <div className={cx("settings__title")}>
        <span>Settings</span>
      </div>
      <div className={cx("settings__content")}>
        <div
          className={cx("settings__content__element")}
          style={
            locate === "/user-info/edit" ? { background: "#262626" } : null
          }
          onClick={() => {
            navigate("/user-info/edit", { replace: true });
          }}
        >
          Edit profile
        </div>
        <div
          className={cx("settings__content__element")}
          style={
            locate === "/accounts/changePass" ? { background: "#262626" } : null
          }
          onClick={() => {
            navigate("/accounts/changePass", { replace: true });
          }}
        >
          Change Password
        </div>
        <div className={cx("settings__content__element")}>
          Push notifications
        </div>
        <div className={cx("settings__content__element")}>What you see</div>
      </div>
    </div>
  );
};
export default Setting;
