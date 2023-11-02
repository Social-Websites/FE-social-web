import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Auth.scss";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { Button, Paper } from "@mui/material";

const cx = classNames.bind(styles);

const ForgotPasswordPage = () => {
  //const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/accounts/login";

  const [otp, setOtp] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (otp && otp.length === 6) {
      return setIsComplete(true);
    }
    return setIsComplete(false);
  }, [otp]);

  const handleSubmit = async (e) => {};

  return (
    <div className={cx("main")}>
      <Paper elevation={0} square className={cx("center-screen")}>
        <div className={cx("logo--container")}>
          <span className={cx("lock-icon")}></span>
        </div>
        <div className={cx("logo--container")}>
          <span dir="auto" style={{ fontWeight: 600 }}>
            Nhập mã OTP được gửi qua email vào ô dưới đây
          </span>
        </div>
        <div className={cx("form--container")}>
          <form className={cx("form--main")}>
            <div className={cx("form--separate")}>
              <div className={cx("input--margin")}>
                <div className={cx("otp__container")}>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    inputType="tel"
                    shouldAutoFocus={true}
                    renderInput={(props) => <input {...props} />}
                  />
                </div>
              </div>
              <span className={cx("signup--container")} dir="auto">
                <p className={cx("signup--question")}>
                  Chưa nhận được OTP?
                  <br />
                  <Button
                    href=""
                    className={cx("signup--link")}
                    role="link"
                    tabIndex={0}
                  >
                    <span className={cx("signup--text")} dir="auto">
                      Gửi lại
                    </span>
                  </Button>
                </p>
              </span>

              <div className={cx("button--container")}>
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  size="small"
                  variant="contained"
                  sx={{ bgcolor: "#03a9f4" }}
                  disabled={!isComplete}
                >
                  <div className={cx("button--text")}>Xác thực</div>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Paper>
    </div>
  );
};

export default ForgotPasswordPage;
