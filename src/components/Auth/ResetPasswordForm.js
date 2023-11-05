import React, { useEffect, useState } from "react";
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
import {
  login,
  resetPassword,
  verifyResetUrl,
} from "../../services/userService";
import useHttpClient from "../../shared/hook/http-hook/public-http-hook";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const cx = classNames.bind(styles);

const ResetPasswordForm = () => {
  const { token } = useParams();
  const { auth, persist, setAuth, setPersistLogin } = useAuth();
  const [isValidToken, setIsValidToken] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = "/accounts/login";

  const { isLoading, error, clearError, publicRequest } = useHttpClient();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const verifyLink = async () => {
      try {
        const response = await verifyResetUrl(token, publicRequest);
        console.log(response.message);
        if (response.message) {
          setIsValidToken(true);
        }
      } catch (err) {}
    };
    verifyLink();
  }, [token]);

  const [formData, setFormData] = useState({
    resetToken: token,
    password: "",
  });
  const [inputError, setInputError] = useState({
    passwordError: false,
  });

  const [isTouched, setIsTouched] = useState({
    password: false,
  });

  useEffect(() => {
    return validateInput();
  }, [formData.password, isTouched]);

  const [formValid, setFormValid] = useState();

  const validateInput = () => {
    setInputError((prev) => ({
      ...prev,
      passwordError:
        isTouched.password &&
        (!formData.password ||
          formData.password.length < 5 ||
          formData.password.length > 20),
    }));
  };

  const changeHandler = (e) => {
    setFormData((prev) => ({
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
    if (inputError.passwordError || !formData.password) {
      setFormValid("Mật khẩu phải lớn hơn 5 và nhỏ hơn 20 ký tự!");
      return;
    }

    setFormValid(null);

    try {
      const response = await resetPassword(formData, publicRequest);
      console.log(response.message);
      if (response.message) {
        navigate(from, { replace: true });
      }
    } catch (err) {}
  };

  if (isValidToken) {
    return (
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
                    <div className={cx("button--text")}>Đặt lại mật khẩu</div>
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
            </form>
          </div>
        </Paper>
      </div>
    );
  } else {
    // Nếu token không hợp lệ, chuyển hướng trả về dòng lỗi
    return (
      <div>
        <h2>
          {error} <a href="/accounts/login">Trở về trang đăng nhập</a>
        </h2>
      </div>
    );
  }
};

export default ResetPasswordForm;
