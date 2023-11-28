import React, { useContext } from "react";
import classNames from "classnames/bind";
import styles from "./EditProfilePage.module.scss";
import Button from "@mui/material/Button";
import Sidenav from "../../shared/components/NavBar";
import Setting from "../../components/Setting";
import { StateContext } from "../../context/StateContext";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import { rgbToHex } from "@mui/material";

const cx = classNames.bind(styles);

const EditProfilePage = () => {
  const { user } = useContext(StateContext);

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
          <div className={cx("editProfile__content__title")}>Edit profile</div>
          <div className={cx("editProfile__content__info")}>
            <div className={cx("editProfile__content__info__subject")}>
              <img
                style={{ width: "44px", height: "44px" }}
                src={getAvatarUrl(user?.profile_picture)}
                alt=""
              />
            </div>
            <div className={cx("editProfile__content__info__user")}>
              <span className={cx("editProfile__username")}>
                {user?.username}
              </span>
              <span className={cx("editProfile__changeAvatar")}>
                Change profile photo
              </span>
            </div>
          </div>
          <div className={cx("editProfile__content__info")}>
            <div className={cx("editProfile__content__info__subject")}>
              <span>Bio</span>
            </div>
            <div className={cx("editProfile__content__info__textarea")}>
              <textarea placeholder="Bio..."></textarea>
            </div>
          </div>
          <div className={cx("editProfile__content__info")}>
            <div className={cx("editProfile__content__info__subject")}>
              <span></span>
            </div>
            <div className={cx("editProfile__content__info__button")}>
              <Button
                sx={{
                  fontFamily: "inherit",
                  textTransform: "none",
                  ":hover": {
                    opacity: 0.85,
                  },
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
