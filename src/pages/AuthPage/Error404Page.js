import React from "react";
import classNames from "classnames/bind";
import styles from "./AuthPage.scss";

import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Error404Page = ({ notAuthPage }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventdefault();

    navigate("/accounts/login", { replace: true });
  };

  return (
    <div style={{ fontFamily: "inherit", color: "inherit" }}>
      <h2 style={{ fontFamily: "inherit", color: "inherit" }}>
        Page not found{" "}
        {!notAuthPage && <a href="/accounts/login">Back to Login</a>}
      </h2>
    </div>
  );
};

export default Error404Page;
