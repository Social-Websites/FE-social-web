import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "@mui/material";
import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Sidenav from "../../shared/components/NavBar";
import GridOnIcon from "@mui/icons-material/GridOn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PortraitOutlinedIcon from "@mui/icons-material/PortraitOutlined";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import { useParams } from "react-router-dom";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { getUserByUsername } from "../../services/userService";

const cx = classNames.bind(styles);

function Profile() {
  const { user } = useAuth();
  const { username } = useParams();
  const { isLoading, error, clearError, privateRequest } =
    usePrivateHttpClient();
  const myProfile = user?.username === username;
  const [userData, setUserData] = useState(user);

  const effectRan = useRef(false);

  useEffect(() => {
    if (
      (effectRan.current === true || process.env.NODE_ENV !== "development") &&
      !myProfile
    ) {
      const fetchUser = async () => {
        try {
          const response = await getUserByUsername(username, privateRequest);

          setUserData(response);
        } catch (err) {
          console.log(err.message);
        }
      };
      fetchUser();
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  return (
    <div
      className={cx("profile")}
      style={{ backgroundColor: "black", height: "100%" }}
    >
      <div className={cx("profile__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("profile__right")}>
        <div className={cx("profile__content")}>
          <div className={cx("profile__header")}>
            <div className={cx("profile_avatar")}>
              <Avatar className={cx("avatar")} style={{ position: "inherit" }}>
                A
              </Avatar>
            </div>
            <div className={cx("profile__info")}>
              <div className={cx("profile__user")}>
                <span>{userData?.username}</span>
                <button className={cx("profile__button")}>
                  <span>Edit</span>
                </button>
                <button className={cx("profile__button")}>
                  <span>View Archive</span>
                </button>
              </div>
              <div className={cx("profile__user__2")}>
                <span>{userData?.posts.length} Bài viết</span>
                <a className={cx("follow")}>
                  {userData?.friends.length} Bạn bè
                </a>
                <a className={cx("follow")}>
                  {userData?.friend_requests.length} Yêu cầu kết bạn
                </a>
              </div>
              <div className={cx("profile__user__3")}>
                <span>{userData?.full_name}</span>
              </div>
            </div>
          </div>

          <div className={cx("profile__post__tag")}>
            <a>
              <div className={cx("choose")}>
                <GridOnIcon className={cx("icon")} />
                <span className={cx("span")}>Bài viết</span>
              </div>
            </a>
            <a>
              <div className={cx("choose")}>
                <BookmarkBorderIcon className={cx("icon")} />
                <span className={cx("span")}>Đã lưu</span>
              </div>
            </a>
            <a>
              <div className={cx("choose")} style={{ marginRight: "0px" }}>
                <PortraitOutlinedIcon className={cx("icon")} />
                <span className={cx("span")}>Được nhắc đến</span>
              </div>
            </a>
          </div>
          <div className={cx("profile__posts")}>
            <div className={cx("profile__post")}>
              <img src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80" />
            </div>
            <div className={cx("profile__post")}>
              <img src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80" />
            </div>
            <div className={cx("profile__post")}>
              <img src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80" />
            </div>
            <div className={cx("profile__post")}>
              <img src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
