import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Auth.scss";
import { Button, Paper, TextField } from "@mui/material";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import { useLocation, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const ForgotPasswordPage = () => {
  //const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/accounts/login";

  const [forgotPassForm, setForgotPassForm] = useState({ forgotAccInput: "" });

  const [forgotAccError, setForgotAccError] = useState(false);

  const onBlurHandler = () => {
    const { forgotAccInput } = forgotPassForm;
    if (!forgotAccInput || forgotAccInput.length < 5) {
      setForgotAccError(true);
      return;
    }
    setForgotAccError(false);
  };

  const changeHandler = (e) => {
    setForgotPassForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {};

  return (
    <div className={cx("back-ground")}>
      <div className={cx("main")}>
        <Paper elevation={0} square className={cx("center-screen")}>
          <div className={cx("logo--container")}>
            <span className={cx("lock-icon")}></span>
          </div>
          <div className={cx("logo--container")}>
            <span dir="auto" style={{ fontWeight: 600 }}>
              Bạn gặp sự cố khi đăng nhập?
            </span>
          </div>
          <div className={cx("form--container")}>
            <form className={cx("form--main")}>
              <div className={cx("form--separate")}>
                <div className={cx("input--margin")}>
                  <div className={cx("input--container")}>
                    <TextField
                      error={forgotAccError}
                      id="forgotAccInput"
                      label="Email hoặc tên đăng nhập"
                      variant="filled"
                      fullWidth={true}
                      size="small"
                      onChange={changeHandler}
                      onBlur={onBlurHandler}
                    />
                  </div>
                </div>

                <div className={cx("button--container")}>
                  <Button
                    onClick={handleSubmit}
                    fullWidth
                    size="small"
                    variant="contained"
                    sx={{ bgcolor: "#03a9f4" }}
                  >
                    <div className={cx("button--text")}>
                      Gửi liên kết lấy lại mật khẩu
                    </div>
                  </Button>
                </div>
                <div className={cx("button--container")}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <div className={cx("or--text")}>HOẶC</div>
                  </div>
                </div>
              </div>
              <Button
                className={cx("forgot--link")}
                href="/accounts/signup/"
                role="link"
                tabIndex={0}
              >
                <span className={cx("forgot--text")} dir="auto">
                  Tạo tài khoản mới!
                </span>
              </Button>
            </form>
          </div>
        </Paper>
        <Paper elevation={0} square className={cx("center-screen")}>
          <span className={cx("signup--container")} dir="auto">
            <Button
              className={cx("forgot--link")}
              href="/accounts/login/"
              role="link"
              tabIndex={0}
            >
              <span className={cx("forgot--text")} dir="auto">
                Quay về trang đăng nhập
              </span>
            </Button>
          </span>
        </Paper>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
