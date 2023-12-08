import React from "react";
import classNames from "classnames/bind";
import styles from "./AuthPage.scss";

import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventdefault();

    navigate("/accounts/login", { replace: true });
  };

  return (
    <div style={{ fontFamily: "inherit", color: "inherit" }}>
      <h2 style={{ fontFamily: "inherit", color: "inherit" }}>
        Error 403 forbidden <a href="/accounts/login">Back to Login</a>
      </h2>
    </div>
  );
};

export default UnauthorizedPage;
