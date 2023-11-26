import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Sidenav from "../../shared/components/NavBar";
import GridOnIcon from "@mui/icons-material/GridOn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PortraitOutlinedIcon from "@mui/icons-material/PortraitOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import { useParams } from "react-router-dom";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { getUserByUsername } from "../../services/userService";
import FriendRequest from "../../components/FriendRequest"

const cx = classNames.bind(styles);

function Profile() {
  const { user } = useAuth();
  const { username } = useParams();
  const privateHttpRequest = usePrivateHttpClient();

  const [userData, setUserData] = useState(null);
  const [more, setMore] = useState(false);
  const [unFQuestion, setUnFQuestion] = useState(false);

  const effectRan = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserByUsername(
          username,
          privateHttpRequest.privateRequest
        );

        setUserData(response);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchUser();
  }, [username]);

  const isOwnProfile = user?.username === userData?.username;
  const isFriend = /*true;*/ userData?.friends.includes(user._id);

  // useEffect(() => {
  //   console.log("own ", isOwnProfile);
  //   console.log("friend ", isFriend);
  // }, [isOwnProfile, isFriend]);

  const handleAddFriend = async () => {};
  const handleFriendRequests = async () => {
    toggleMore();
  };
  const handleUnFriend = async () => {};
  const handleUnfriendQuestion = async () => {
    setUnFQuestion(!unFQuestion);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };
  const toggleMore = () => {
    setMore(!more);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const avatarUrl =
    userData?.profile_picture === ""
      ? "/static-resources/default-avatar.jpg"
      : userData?.profile_picture;

  return (
    !privateHttpRequest.isLoading && (
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
                <img
                  className={cx("avatar")}
                  style={{ position: "inherit" }}
                  src={avatarUrl}
                />
              </div>
              <div className={cx("profile__info")}>
                <div className={cx("profile__user")}>
                  <span>{userData?.username}</span>
                  <button
                    onClick={
                      isOwnProfile
                        ? handleFriendRequests
                        : isFriend
                        ? handleUnfriendQuestion
                        : handleAddFriend
                    }
                    className={cx("profile__button")}
                  >
                    <span>
                      {isOwnProfile ? (
                        "Friend requests"
                      ) : isFriend ? (
                        <>
                          Friends
                          <ExpandMoreIcon />
                        </>
                      ) : (
                        "Add friend"
                      )}
                    </span>
                  </button>
                  <button className={cx("profile__button")}>
                    <span>Edit profile</span>
                  </button>
                </div>
                <div className={cx("profile__user__2")}>
                  <span>{userData?.posts.length} Posts</span>
                  <a className={cx("follow")}>
                    {userData?.friends.length} Friends
                  </a>
                  <a className={cx("follow")}>
                    {userData?.friend_requests.length} Requests
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
                  <span
                    className={cx("span")}
                    style={{ textTransform: "uppercase" }}
                  >
                    Posts
                  </span>
                </div>
              </a>
              <a>
                <div className={cx("choose")}>
                  <BookmarkBorderIcon className={cx("icon")} />
                  <span
                    className={cx("span")}
                    style={{ textTransform: "uppercase" }}
                  >
                    Saved
                  </span>
                </div>
              </a>
              <a>
                <div className={cx("choose")} style={{ marginRight: "0px" }}>
                  <PortraitOutlinedIcon className={cx("icon")} />
                  <span
                    className={cx("span")}
                    style={{ textTransform: "uppercase" }}
                  >
                    Tagged
                  </span>
                </div>
              </a>
            </div>
            <div className={cx("profile__posts")}>
              {userData?.posts.map((post) => (
                <div className={cx("profile__post")}>
                  <img src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {unFQuestion && (
          <div className={cx("post-modal active-post-modal")}>
            <div
              onClick={handleUnfriendQuestion}
              className={cx("post-overlay")}
              style={{ alignSelf: "flex-end" }}
            ></div>
            <div className={cx("more-content")}>
              <div
                className={cx("more-content-element")}
                style={{ color: "#ed4956" }}
                onClick={handleUnFriend}
              >
                UnFriend
              </div>
              <div
                className={cx("more-content-element")}
                onClick={handleUnfriendQuestion}
              >
                Cancel
              </div>
            </div>
          </div>
        )}

        {more && (
          <div className={cx("profile-modal active-profile-modal")}>
            <div
              onClick={toggleMore}
              className={cx("profile-overlay")}
              style={{ alignSelf: "flex-end" }}
            >
              <CloseIcon
                className={cx("sidenav__icon")}
                style={{
                  width: "27px",
                  height: "27px",
                  color: "white",
                  margin: "12px 30px",
                  position: "absolute",
                  right: "0",
                  cursor: "pointer",
                }}
              />
            </div>
            <div className={cx("profile-modal-content")}>
              <div className={cx("profile-modal-content-header")}>
                Friend requests
              </div>
              <div className={cx("profile-modal-content-no-users")}>
                <span>No Friend Requests</span>
              </div>
              {/* <div className={cx("profile-modal-content-users")}>
                <FriendRequest/>
                <FriendRequest/>
                <FriendRequest/>
                <FriendRequest/>
                <FriendRequest/>
                <FriendRequest/>
                <FriendRequest/>
                <FriendRequest/>
                <FriendRequest/>
              </div> */}
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default Profile;
