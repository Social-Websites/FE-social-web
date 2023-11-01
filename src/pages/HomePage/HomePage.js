import React, { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./HomePage.scss";
import Sidenav from "../../shared/components/NavBar";
import Timeline from "../../components/TimeLine";
import useLogout from "../../shared/hook/auth-hook/logout-hook";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function HomePage() {
  const navigate = useNavigate();
  const { isLoading, error, clearError, logout } = useLogout();

  const signOut = async () => {
    await logout();

    navigate("/accounts/login");
  };

  return (
    <div className={cx("homepage")}>
      <div className={cx("homepage__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("homepage__timeline")}>
        <Timeline style={{ width: "90%" }} />
      </div>
    </div>
  );
}

export default HomePage;
