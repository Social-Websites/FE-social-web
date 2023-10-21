import React from "react";
import classNames from 'classnames/bind';
import styles from "./HomePage.scss";
import Sidenav from "../../shared/components/NavBar";
import Timeline from "../../components/TimeLine";

const cx = classNames.bind(styles);

function HomePage() {
  return (
    <div className={cx("homepage")}>
      <div className={cx("homepage__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("homepage__timeline")}>
        <Timeline style={{width: "90%"}}/>
      </div>
    </div>
  );
}

export default HomePage;