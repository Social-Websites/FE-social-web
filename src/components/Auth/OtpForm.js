import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Auth.scss";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { Alert, Button, Paper } from "@mui/material";
import useHttpClient from "../../shared/hook/http-hook/public-http-hook";
import { getOtpSignUp, signUp } from "../../services/userService";

const cx = classNames.bind(styles);

const INITIAL_SECONDS = 120;
const RESEND_SECONDS = 30;
const twoDigits = (num) => String(num).padStart(2, "0");

const OtpForm = () => {
  const { otpToken, regisInfo } = useAuth();

  const { isLoading, error, clearError, publicRequest } = useHttpClient();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/accounts/login";

  useEffect(() => {
    if (!regisInfo) {
      return navigate("/error/404-error", { replace: true });
    }
  }, [regisInfo]);

  const [otp, setOtp] = useState("");
  const [otpVerify, setOtpVerify] = useState(otpToken);
  const [isComplete, setIsComplete] = useState(false);

  const getOtp = async () => {
    const response = await getOtpSignUp(
      regisInfo.username,
      regisInfo.email,
      publicRequest
    );
    console.log(response.otpToken);
    setOtpVerify(response.otpToken);
  };

  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const secondsToDisplay = seconds % 60;
  const minutes = (seconds - secondsToDisplay) / 60;
  const minutesToDisplay = minutes % 60;
  const hoursToDisplay = (minutes - minutesToDisplay) / 60;

  const [resendSeconds, setResendSeconds] = useState(0);
  const resendSecondsToDisplay = resendSeconds % 60;
  const resendMinutes = (resendSeconds - resendSecondsToDisplay) / 60;
  const resendMinutesToDisplay = resendMinutes % 60;
  const resendHoursToDisplay = (resendMinutes - resendMinutesToDisplay) / 60;

  useEffect(() => {
    const otpInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(otpInterval);
        }
      }
    }, 1000);

    return () => {
      clearInterval(otpInterval);
    };
  }, [seconds]);

  useEffect(() => {
    const resendInterval = setInterval(() => {
      if (resendSeconds > 0) {
        setResendSeconds(resendSeconds - 1);
      }

      if (resendSeconds === 0) {
        clearInterval(resendInterval);
      }
    }, 1000);

    return () => {
      clearInterval(resendInterval);
    };
  }, [resendSeconds]);

  useEffect(() => {
    if (otp && otp.length === 6) {
      return setIsComplete(true);
    }
    return setIsComplete(false);
  }, [otp]);

  const resendOtp = async () => {
    try {
      await getOtp();
    } catch (err) {}
    setResendSeconds(RESEND_SECONDS);
    setSeconds(INITIAL_SECONDS);
  };

  const handleSubmit = async (e) => {
    const signUpForm = {
      otp: otp,
      otpToken: otpVerify,
      email: regisInfo.email,
      fullname: regisInfo.fullname,
      username: regisInfo.username,
      password: regisInfo.password,
    };
    try {
      const response = await signUp(signUpForm, publicRequest);
      console.log(response.message);

      navigate(from, { replace: true });
    } catch (err) {}
  };

  return (
    <div className={cx("main")}>
      <Paper elevation={0} square className={cx("center-screen")}>
        <div className={cx("logo--container")}>
          <span className={cx("lock-icon")}></span>
        </div>
        <span dir="auto" style={{ fontSize: 30, fontWeight: 600 }}>
          OTP
        </span>
        <div className={cx("logo--container")}>
          <span dir="auto" style={{ fontWeight: 200 }}>
            Nhập mã OTP xác thực vào đây
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
                    renderSeparator={<span>&nbsp;</span>}
                    shouldAutoFocus={true}
                    renderInput={(props) => <input {...props} />}
                  />
                </div>
              </div>

              <p className={cx("signup--question")}>
                Thời gian hết hạn:{" "}
                <span style={{ fontWeight: 600 }}>
                  {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
                </span>
              </p>

              <p className={cx("signup--question")}>
                Chưa nhận được OTP?
                <br />
                <Button
                  href=""
                  className={cx("signup--link")}
                  role="link"
                  tabIndex={0}
                  disabled={resendSeconds > 0}
                  onClick={resendOtp}
                >
                  <span className={cx("signup--text")} dir="auto">
                    Gửi lại
                  </span>
                </Button>
                {resendSeconds > 0 ? (
                  <span>
                    sau:{" "}
                    <span style={{ fontWeight: 600 }}>
                      {twoDigits(resendMinutesToDisplay)}:
                      {twoDigits(resendSecondsToDisplay)}
                    </span>
                  </span>
                ) : (
                  ""
                )}
              </p>

              <div className={cx("button--container")}>
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  size="small"
                  variant="contained"
                  sx={{ bgcolor: "#03a9f4" }}
                  disabled={!isComplete || seconds === 0}
                >
                  <div className={cx("button--text")}>
                    {seconds > 0 ? "Xác thực" : "Hết hạn"}
                  </div>
                </Button>
              </div>
              <div className={cx("input--margin")}>
                {error && <Alert severity="error">{error}</Alert>}
              </div>
            </div>
          </form>
        </div>
      </Paper>
    </div>
  );
};

export default OtpForm;
