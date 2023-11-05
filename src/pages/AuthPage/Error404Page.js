import React from "react";
import classNames from "classnames/bind";
import styles from "./AuthPage.scss";

import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Error404Page = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventdefault();

    navigate("/accounts/login", { replace: true });
  };

  return (
    <div>
      <h2>
        Lỗi 404 không tìm thấy trang{" "}
        <a href="/accounts/login">Trở về trang đăng nhập</a>
      </h2>
    </div>
  );
};

export default Error404Page;
