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
import { login } from "../../services/userService";
import useHttpClient from "../../shared/hook/http-hook/public-http-hook";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import { useLocation, useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";

const cx = classNames.bind(styles);

const LoginPage = () => {
  const { auth, persist, setAuth, setPersistLogin } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = "/";

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

  // const [isTouched, setIsTouched] = useState({
  //   username: false,
  //   password: false,
  // });

  useEffect(() => {
    const persisting = JSON.parse(localStorage.getItem("persist") || false);
    if (persisting) navigate(from, { replace: true });
  }, []);

  // useEffect(() => {
  //   return validateInput();
  // }, [formData.username, formData.password, isTouched]);

  const [formValid, setFormValid] = useState();

  const validateInput = (e) => {
    switch (e.target.id) {
      case "username":
        setInputError((prev) => ({
          ...prev,
          usernameError: !e.target.value,
        }));
        break;
      case "password":
        setInputError((prev) => ({
          ...prev,
          passwordError: !e.target.value,
        }));
        break;
    }
  };

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    // setIsTouched((prev) => ({
    //   ...prev,
    //   [e.target.id]: true,
    // }));
    validateInput(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputError.usernameError || !formData.username) {
      setFormValid("Username is empty!");
      return;
    }
    if (inputError.passwordError || !formData.password) {
      setFormValid("Password is empty!");
      return;
    }

    setFormValid(null);

    try {
      const response = await login(formData, publicRequest);
      const accessToken = response?.accessToken;
      if (accessToken) {
        setAuth({ accessToken });
        setPersistLogin();
        navigate(from, { replace: true });
        clearError();
      } else setFormValid("Login fail, please try again later!");
    } catch (err) {}
  };

  return (
    <div
      className={cx("main")}
      style={{ filter: isLoading ? "brightness(90%)" : "brightness(100%)" }}
    >
      {isLoading && <LinearProgress />}
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
                    label="Username"
                    variant="filled"
                    fullWidth={true}
                    size="small"
                    onChange={changeHandler}
                    disabled={isLoading}
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
                    <InputLabel htmlFor="password">Password</InputLabel>
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      onChange={changeHandler}
                      disabled={isLoading}
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
                  disabled={isLoading}
                >
                  <div className={cx("button--text")}>Login</div>
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
              disabled={isLoading}
            >
              <span className={cx("forgot--text")} dir="auto">
                Forgot password?
              </span>
            </Button>
          </form>
        </div>
      </Paper>
      <Paper elevation={0} square className={cx("center-screen")}>
        <span className={cx("signup--container")} dir="auto">
          <p className={cx("signup--question")}>
            Don't have an account?&nbsp;
            <Button
              href="/accounts/signup/"
              className={cx("signup--link")}
              role="link"
              tabIndex={0}
              disabled={isLoading}
            >
              <span className={cx("signup--text")} dir="auto">
                Sign Up
              </span>
            </Button>
          </p>
        </span>
      </Paper>
    </div>
  );
};

export default LoginPage;
