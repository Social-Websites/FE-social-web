import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Auth.scss";
import { Alert, Button, Paper, TextField } from "@mui/material";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import { useLocation, useNavigate } from "react-router-dom";
import useHttpClient from "../../shared/hook/http-hook/public-http-hook";
import { forgotPassword } from "../../services/userService";

const cx = classNames.bind(styles);

const ForgotPasswordPage = () => {
  //const { setAuth } = useAuth();

  const { isLoading, error, clearError, publicRequest } = useHttpClient();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/accounts/login";

  const [forgotPassForm, setForgotPassForm] = useState({ usernameOrEmail: "" });
  const [inputError, setInputError] = useState({
    usernameOrEmailErorr: false,
  });

  const [isTouched, setIsTouched] = useState({
    usernameOrEmail: false,
  });

  useEffect(() => {
    return validateInput();
  }, [forgotPassForm.usernameOrEmail, isTouched]);

  const [formValid, setFormValid] = useState();
  const [formSuccess, setFormSuccess] = useState();

  const validateInput = () => {
    setInputError((prev) => ({
      ...prev,
      usernameOrEmailError:
        isTouched.usernameOrEmail && !forgotPassForm.usernameOrEmail,
    }));
  };

  const changeHandler = (e) => {
    setForgotPassForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setIsTouched((prev) => ({
      ...prev,
      [e.target.id]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputError.usernameOrEmailError || !forgotPassForm.usernameOrEmail) {
      setFormValid("Field cannot be empty!");
      return;
    }

    setFormValid(null);

    try {
      const response = await forgotPassword(forgotPassForm, publicRequest);
      console.log(response.message);
      if (response.message) {
        setFormSuccess(response.message);
      }
    } catch (err) {}
  };

  return (
    <div className={cx("main")}>
      <Paper elevation={0} square className={cx("center-screen")}>
        <div className={cx("logo--container")}>
          <span className={cx("lock-icon")}></span>
        </div>
        <div className={cx("logo--container")}>
          <span dir="auto" style={{ fontWeight: 600 }}>
            Have some problem when login?
          </span>
        </div>
        <div className={cx("form--container")}>
          <form className={cx("form--main")}>
            <div className={cx("form--separate")}>
              <div className={cx("input--margin")}>
                {formSuccess && <Alert severity="success">{formSuccess}</Alert>}
              </div>
              <div className={cx("input--margin")}>
                <div className={cx("input--container")}>
                  <TextField
                    id="usernameOrEmail"
                    label="Email or username"
                    variant="filled"
                    fullWidth={true}
                    size="small"
                    onChange={changeHandler}
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
                  <div className={cx("button--text")}>Get verification</div>
                </Button>
              </div>
              <div className={cx("input--margin")}>
                {formValid && !error ? (
                  <Alert severity="error">{formValid}</Alert>
                ) : (
                  error && <Alert severity="error">{error}</Alert>
                )}
              </div>
              <div className={cx("button--container")}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <div className={cx("or--text")}>OR</div>
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
                Create new account!
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
              Back to login
            </span>
          </Button>
        </span>
      </Paper>
    </div>
  );
};

export default ForgotPasswordPage;
