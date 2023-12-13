import React, { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./AuthPage.scss";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.pathname || "/accounts";

  useEffect(() => {
    if (from === "/accounts" || from === "/accounts/") navigate("./login");
  }, []);

  return (
    <div className={cx("back-ground")}>
      <Outlet />
    </div>
  );
};

export default AuthPage;
