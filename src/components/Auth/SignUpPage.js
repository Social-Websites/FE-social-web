import React, { useContext, useEffect, useState } from "react";
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
import { getOtpSignUp } from "../../services/userService";
import useHttpClient from "../../shared/hook/http-hook/public-http-hook";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import { useLocation, useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";

const cx = classNames.bind(styles);

const EMAIL_REGEX = /^[a-z0-9.-]+@[a-z.]+\.[a-z]{2,4}$/;

const SignUpPage = () => {
  const { setOtp, setRegisterInfo } = useAuth();
  const { isLoading, error, clearError, publicRequest } = useHttpClient();

  const navigate = useNavigate();
  const location = useLocation();
  const from = "/accounts/otp";

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    username: "",
    password: "",
  });
  const [inputError, setInputError] = useState({
    emailError: false,
    fullnameError: false,
    usernameError: false,
    passwordError: false,
  });

  // const [isTouched, setIsTouched] = useState({
  //   email: false,
  //   fullname: false,
  //   username: false,
  //   password: false,
  // });

  // useEffect(() => {
  //   return validateInput();
  // }, [
  //   formData.email,
  //   formData.fullname,
  //   formData.username,
  //   formData.password,
  //   isTouched,
  // ]);

  const [formValid, setFormValid] = useState();

  const validateInput = (e) => {
    switch (e.target.id) {
      case "email":
        setInputError((prev) => ({
          ...prev,
          emailError: !EMAIL_REGEX.test(e.target.value),
        }));
        break;
      case "fullname":
        setInputError((prev) => ({
          ...prev,
          fullnameError: !e.target.value || e.target.value.length < 5,
        }));
        break;
      case "username":
        setInputError((prev) => ({
          ...prev,
          usernameError:
            !e.target.value ||
            e.target.value.length < 5 ||
            e.target.value.length > 15,
        }));
        break;
      case "password":
        setInputError((prev) => ({
          ...prev,
          passwordError:
            !e.target.value ||
            e.target.value.length < 5 ||
            e.target.value.length > 20,
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

    if (inputError.emailError || !formData.email) {
      setFormValid("Email not valid!");
      return;
    }
    if (inputError.fullnameError || !formData.fullname) {
      setFormValid("Fullname not valid!");
      return;
    }
    if (inputError.usernameError || !formData.username) {
      setFormValid(
        "Username must be greater than 5 and less than 15 characters!"
      );
      return;
    }
    if (inputError.passwordError || !formData.password) {
      setFormValid(
        "Password must be greater than 5 and less than 20 characters!"
      );
      return;
    }

    setFormValid(null);

    try {
      const response = await getOtpSignUp(
        formData.username,
        formData.email,
        publicRequest
      );
      console.log(response.otpToken);
      if (response.otpToken) {
        setOtp(response.otpToken);
        setRegisterInfo(formData);
        navigate(from, { replace: true });
      }
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
                    error={inputError.emailError}
                    id="email"
                    label="Email"
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
                  <TextField
                    error={inputError.fullnameError}
                    id="fullname"
                    label="Fullname"
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
                  <div className={cx("button--text")}>Sign Up</div>
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
      <Paper elevation={0} square className={cx("center-screen")}>
        <span className={cx("signup--container")} dir="auto">
          <p className={cx("signup--question")}>
            You have an account?&nbsp;
            <Button
              href="/accounts/login/"
              className={cx("signup--link")}
              role="link"
              tabIndex={0}
              disabled={isLoading}
            >
              <span className={cx("signup--text")} dir="auto">
                Login
              </span>
            </Button>
          </p>
        </span>
      </Paper>
    </div>
  );
};

export default SignUpPage;
