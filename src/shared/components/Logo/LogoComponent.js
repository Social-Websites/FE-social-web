import React from "react";
import classNames from "classnames/bind";
import styles from "./Logo.scss";
import logo from "./NESTME-3.jpg";

const cx = classNames.bind(styles);

function LogoComponent(props) {
  return (
    <div>
      <img src={logo} alt="NESTME" className={cx("logo", props.className)} />
    </div>
  );
}

export default LogoComponent;
