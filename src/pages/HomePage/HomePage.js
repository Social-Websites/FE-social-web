import React, { useEffect, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./HomePage.scss";
import Sidenav from "../../shared/components/NavBar";
import Timeline from "../../components/TimeLine";
import useLogout from "../../shared/hook/auth-hook/logout-hook";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/userService";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";

const cx = classNames.bind(styles);

function HomePage() {
  const navigate = useNavigate();

  const topPage = useRef();

  const scrollToTop = () => {
    if (topPage.current) {
      topPage.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={cx("homepage")}>
      <div className={cx("homepage__navWraper")}>
        <Sidenav onScrollToTop={scrollToTop} />
      </div>
      <div ref={topPage} className={cx("homepage__timeline")}>
        <Timeline style={{ width: "90%" }} />
      </div>
    </div>
  );
}

export default HomePage;
