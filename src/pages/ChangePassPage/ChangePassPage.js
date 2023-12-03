import React, { useContext, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ChangePassPage.module.scss";
import Sidenav from "../../shared/components/NavBar";
import Setting from "../../components/Setting";
import { StateContext } from "../../context/StateContext";
import { Button, CircularProgress } from "@mui/material";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { updateUserPassword } from "../../services/userService";
import useLogout from "../../shared/hook/auth-hook/logout-hook";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const ChangePassPage = () => {
  const { logout } = useLogout();
  const navigate = useNavigate();
  const privateHttpRequest = usePrivateHttpClient();

  const [updatePassLoading, setUpdatePassLoading] = useState(false);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [repeatNewPass, setRepeatNewPass] = useState("");
  const [alert, setAlert] = useState(null);

  const updatePass = async () => {
    if (!(oldPass === "" && newPass === "" && repeatNewPass === "")) {
      setAlert(null);
      if (newPass !== repeatNewPass) {
        setAlert("Repeat password not equal to new password!");
        return;
      }
      setUpdatePassLoading(true);
      try {
        const response = await updateUserPassword(
          { oldPass: oldPass, newPass: newPass },
          privateHttpRequest.privateRequest
        );

        if (response.message) {
          setAlert(response.message);
          setUpdatePassLoading(false);
          await logout();
          navigate("/accounts/login");
        }
      } catch (err) {
        setAlert(privateHttpRequest.error);
        setUpdatePassLoading(false);
      }
    }
  };

  return (
    <div className={cx("editProfilePage")}>
      <div className={cx("editProfile__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("editProfile__sideBar")}>
        <Setting />
      </div>
      <div className={cx("editProfile__content")}>
        <div className={cx("editProfile__content__main")}>
          <div className={cx("editProfile__content__title")}>
            Change Password
          </div>
          <div className={cx("editProfile__content__info")}>
            <div className={cx("editProfile__content__info__subject")}>
              <span>Old Password</span>
            </div>
            <div className={cx("editProfile__content__info__textarea")}>
              <input
                type="password"
                placeholder="Old Password..."
                onChange={(e) => setOldPass(e.target.value)}
              ></input>
            </div>
          </div>
          <div className={cx("editProfile__content__info")}>
            <div className={cx("editProfile__content__info__subject")}>
              <span>New Password</span>
            </div>
            <div className={cx("editProfile__content__info__textarea")}>
              <input
                type="password"
                placeholder="New Password..."
                onChange={(e) => setNewPass(e.target.value)}
              ></input>
            </div>
          </div>
          <div className={cx("editProfile__content__info")}>
            <div className={cx("editProfile__content__info__subject")}>
              <span>Repeat Password</span>
            </div>
            <div className={cx("editProfile__content__info__textarea")}>
              <input
                type="password"
                placeholder="Repeat Password..."
                onChange={(e) => setRepeatNewPass(e.target.value)}
              ></input>
            </div>
          </div>
          <div className={cx("editProfile__content__info")}>
            <div className={cx("editProfile__content__info__subject")}>
              <span>{alert}</span>
            </div>
            <div
              className={cx("editProfile__content__info__button")}
              style={{ position: "relative" }}
            >
              <Button
                sx={{
                  fontFamily: "inherit",
                  textTransform: "none",
                  ":hover": {
                    opacity: 0.8,
                  },
                  opacity:
                    !(
                      oldPass !== "" &&
                      newPass !== "" &&
                      repeatNewPass !== ""
                    ) || updatePassLoading
                      ? 0.5
                      : 1,
                }}
                onClick={updatePass}
                disabled={
                  !(oldPass !== "" && newPass !== "" && repeatNewPass !== "") ||
                  updatePassLoading
                }
              >
                Submit
              </Button>
              {updatePassLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-8px",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassPage;
