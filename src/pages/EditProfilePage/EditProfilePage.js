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
import { updateUserProfile } from "../../services/userService";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import {
  getDownloadURL,
  ref,
  storage,
  uploadBytesResumable,
} from "../../config/firebase";
import { updateUserProfileFields } from "../../context/StateAction";

const cx = classNames.bind(styles);

const EditProfilePage = () => {
  const { user, dispatch } = useContext(StateContext);
  const privateHttpRequest = usePrivateHttpClient();

  const [modal, setModal] = useState(false);
  const [uploadProfileImgLoading, setUploadProfileImgLoading] = useState(false);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);

  const fileInputRef = useRef(null);
  const [bio, setBio] = useState(user?.user_info.bio);
  const [bioModified, setBioModified] = useState(false);

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

  const updateBio = async () => {
    setUpdateProfileLoading(true);
    try {
      const respone = await updateUserProfile(
        { user_info: { bio: bio } },
        privateHttpRequest.privateRequest
      );
      if (respone?.message !== null) {
        dispatch(updateUserProfileFields({ user_info: { bio: bio } }));
        setBioModified(false);
        setUpdateProfileLoading(false);
      }
    } catch (err) {
      console.error(err);
      setUpdateProfileLoading(false);
    }
  };

  const selectFiles = () => {
    fileInputRef.current.click();
  };

  const onFileSelect = async (event) => {
    if (modal) {
      toggleModal();
    }
    setUploadProfileImgLoading(true);
    const files = event.target.files;
    if (files.length === 0) return;

    const validFiles = Array.from(files).filter((file) => !notValidFile(file));

    if (validFiles.length === 0) return;

    const selectedImage = {
      name: validFiles[0].name,
      url: URL.createObjectURL(validFiles[0]),
      file: validFiles[0],
    };

    const name = Date.now();
    const storageRef = ref(storage, `images/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedImage.file);

    const uploadPromise = new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              console.log(url);
              resolve(url);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        }
      );
    });

    try {
      const url = await uploadPromise;

      const urlString = url.toString();
      const respone = await updateUserProfile(
        { profile_picture: urlString },
        privateHttpRequest.privateRequest
      );
      if (respone?.message !== null) {
        dispatch(updateUserProfileFields({ profile_picture: urlString }));
        setUploadProfileImgLoading(false);
      }
    } catch (err) {
      console.error(err);
      setUploadProfileImgLoading(false);
    }
  };

  const handleUploadProfileImg = () => {
    if (!uploadProfileImgLoading) {
      if (user?.profile_picture === "") {
        selectFiles();
      } else {
        toggleModal();
      }
    }
  };

  const removePhoto = async () => {
    if (modal) toggleModal();
    setUploadProfileImgLoading(true);
    try {
      const respone = await updateUserProfile(
        { profile_picture: "" },
        privateHttpRequest.privateRequest
      );
      if (respone?.message !== null) {
        dispatch(updateUserProfileFields({ profile_picture: "" }));
        setUploadProfileImgLoading(false);
      }
    } catch (err) {
      console.error(err);
      setUploadProfileImgLoading(false);
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
                    marginTop: "6.6px",
                    marginRight: "6.7px",
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
              <textarea
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setBioModified(true);
                }}
                placeholder="Bio..."
              ></textarea>
            </div>
          </div>
          <div className={cx("editProfile__content__info")}>
            <div className={cx("editProfile__content__info__subject")}>
              <span></span>
            </div>
            <div
              className={cx("editProfile__content__info__button")}
              style={{
                position: "relative",
              }}
            >
              <Button
                sx={{
                  fontFamily: "inherit",
                  textTransform: "none",
                  ":hover": {
                    opacity: 0.8,
                  },
                  opacity: !bioModified || updateProfileLoading ? 0.5 : 1,
                }}
                onClick={updateBio}
                disabled={!bioModified || updateProfileLoading}
              >
                Submit
              </Button>
              {updateProfileLoading && (
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
              Change Profile Photo
            </div>
            <div
              className={cx("more-content-element")}
              style={{ color: "#0095f6", fontWeight: 700 }}
              onClick={selectFiles}
            >
              Upload photo
            </div>
            <div
              className={cx("more-content-element")}
              style={{ color: "#ed4956", fontWeight: 700 }}
              onClick={removePhoto}
            >
              Remove current photo
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
