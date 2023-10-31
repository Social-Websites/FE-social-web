import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Auth.scss";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FilledInput from "@mui/material/FilledInput";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { getUser, login } from "../../services/userService";
import useHttpClient from "../../shared/hook/public-http-hook";
import useAuth from "../../shared/hook/auth-hook";
import { useLocation, useNavigate } from "react-router-dom";
import usePrivateHttpClient from "../../shared/hook/private-http-hook";

const cx = classNames.bind(styles);

const LoginPage = () => {
  const { setAuthLogin } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = "/redirect";

  const { isLoading, error, clearError, publicRequest } = useHttpClient();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [inputError, setInputError] = useState({
    usernameError: false,
    passwordError: false,
  });
  const [formValid, setFormValid] = useState();

  const validateInput = (e) => {
    let valid = false;
    switch (e.target.id) {
      case "username":
        valid = !formData.username;
        setInputError((prev) => ({
          ...prev,
          usernameError: valid,
        }));
        break;
      case "password":
        valid = !formData.password;
        setInputError((prev) => ({
          ...prev,
          passwordError: valid,
        }));
        break;
      default:
        setFormValid(null);
    }
  };

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    validateInput(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputError.usernameError || !formData.username) {
      setFormValid("Tên người dùng không được để trống!");
      return;
    }
    if (inputError.passwordError || !formData.password) {
      setFormValid("Mật khẩu không được để trống!");
      return;
    }

    setFormValid(null);

    try {
      const response = await login(formData, publicRequest);
      const accessToken = response?.accessToken;
      setAuthLogin(accessToken);

      clearError();
      navigate(from, { replace: true });
    } catch (err) {}
  };

  return (
    <div className={cx("back-ground")}>
      <div className={cx("main")}>
        <Paper elevation={0} square className={cx("center-screen")}>
          <div className={cx("logo--container")}>
            <div
              aria-disabled="false"
              role="button"
              tabIndex={0}
              className={cx("cursor")}
            >
              <i
                data-visualcompletion="css-img"
                role="img"
                aria-label="Instagram"
                className={cx("logo--main")}
              ></i>
            </div>
          </div>
          <div className={cx("form--container")}>
            <form className={cx("form--main")}>
              <div className={cx("form--separate")}>
                <div className={cx("input--margin")}>
                  <div className={cx("input--container")}>
                    <TextField
                      error={inputError.usernameError}
                      id="username"
                      label="Tên đăng nhập"
                      variant="filled"
                      fullWidth={true}
                      size="small"
                      onChange={changeHandler}
                    />
                  </div>
                </div>

                <div className={cx("input--margin")}>
                  <div className={cx("input--container")}>
                    <FormControl
                      error={inputError.passwordError}
                      size="small"
                      fullWidth={true}
                      variant="filled"
                    >
                      <InputLabel htmlFor="password">Mật khẩu</InputLabel>
                      <FilledInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        onChange={changeHandler}
                      />
                    </FormControl>
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
                    <div className={cx("button--text")}>Đăng nhập</div>
                  </Button>
                </div>
                <div className={cx("input--margin")}>
                  {formValid && !error ? (
                    <Alert severity="error">{formValid}</Alert>
                  ) : (
                    error && <Alert severity="error">{error}</Alert>
                  )}
                </div>
              </div>
              <Button
                className={cx("forgot--link")}
                href="/accounts/password/reset/"
                role="link"
                tabIndex={0}
              >
                <span className={cx("forgot--text")} dir="auto">
                  Quên mật khẩu?
                </span>
              </Button>
            </form>
          </div>
        </Paper>
        <Paper elevation={0} square className={cx("center-screen")}>
          <span className={cx("signup--container")} dir="auto">
            <p className={cx("signup--question")}>
              Bạn chưa có tài khoản hả?&nbsp;
              <Button
                href="/accounts/signup/"
                className={cx("signup--link")}
                role="link"
                tabIndex={0}
              >
                <span className={cx("signup--text")} dir="auto">
                  Đăng ký
                </span>
              </Button>
            </p>
          </span>
        </Paper>
      </div>
    </div>
  );
};

export default LoginPage;
