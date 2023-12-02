import React, { useContext, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./EditProfilePage.module.scss";
import Button from "@mui/material/Button";
import Sidenav from "../../shared/components/NavBar";
import Setting from "../../components/Setting";
import { StateContext } from "../../context/StateContext";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import { CircularProgress } from "@mui/material";
import { green } from "@mui/material/colors";

const cx = classNames.bind(styles);

const EditProfilePage = () => {
  const { user } = useContext(StateContext);

  const [modal, setModal] = useState(false);
  const [uploadProfileImgLoading, setUploadProfileImgLoading] = useState(false);

  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const toggleModal = () => {
    setModal(!modal);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  //Validate file
  const notValidFile = (file) => {
    //image/jpg,image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm
    return (
      file.type !== "image/jpg" &&
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp"
    );
  };

  const selectFiles = () => {
    fileInputRef.current.click();
  };

  const onFileSelect = (event) => {
    const files = event.target.files;
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      if (notValidFile(files[i])) continue;
      if (!images.some((e) => e.name === files[i].name)) {
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
            file: files[i],
          },
        ]);
      }
    }
  };

  const handleUploadProfileImg = () => {
    if (!uploadProfileImgLoading) {
      setUploadProfileImgLoading(true);
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
          <div className={cx("editProfile__content__title")}>Edit profile</div>
          <div className={cx("editProfile__content__info")}>
            <div
              className={cx("editProfile__content__info__subject")}
              style={{ position: "relative" }}
            >
              <img
                style={{
                  width: "44px",
                  height: "44px",
                  filter: uploadProfileImgLoading
                    ? "brightness(70%)"
                    : "brightness(100%)",
                }}
                src={getAvatarUrl(user?.profile_picture)}
                alt=""
              />
              {uploadProfileImgLoading && (
                <CircularProgress
                  size={30}
                  sx={{
                    color: "blueviolet",
                    position: "absolute",
                    top: 7,
                    left: 120.5,
                    zIndex: 1,
                  }}
                />
              )}
            </div>

            <div className={cx("editProfile__content__info__user")}>
              <span className={cx("editProfile__username")}>
                {user?.username}
              </span>
              <input
                type="file"
                accept="image/jpg,image/jpeg,image/png,image/webp"
                multiple
                ref={fileInputRef}
                onChange={onFileSelect}
                id="myFileInput"
                style={{ display: "none" }}
              />
              <span
                onClick={handleUploadProfileImg}
                className={cx("editProfile__changeAvatar")}
              >
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
      {modal && (
        <div className={cx("profile-modal active-profile-modal")}>
          <div
            onClick={toggleModal}
            className={cx("post-overlay")}
            style={{ alignSelf: "flex-end" }}
          ></div>

          <div className={cx("more-content")}>
            <div
              className={cx("more-content-element")}
              style={{ borderBottomWidth: 3, cursor: "default" }}
            >
              Are you sure?
            </div>
            <div
              className={cx("more-content-element")}
              style={{ color: "#ed4956" }}
              onClick={toggleModal}
            >
              UnFriend
            </div>
            <div className={cx("more-content-element")} onClick={toggleModal}>
              Cancel
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;
