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
    <div>
      <h2>
        Không có quyền truy cập{" "}
        <a href="/accounts/login">Trở về trang đăng nhập</a>
      </h2>
    </div>
  );
};

export default UnauthorizedPage;
