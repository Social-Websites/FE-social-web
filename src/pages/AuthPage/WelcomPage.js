import React from "react";
import classNames from "classnames/bind";
import styles from "./AuthPage.scss";
import LogoComponent from "../../shared/components/Logo/LogoComponent";

const cx = classNames.bind(styles);

const WelcomPage = () => {
  return (
    <div className={cx("logo__container")}>
      <LogoComponent />
    </div>
  );
};

export default WelcomPage;
