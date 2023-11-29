import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Sidenav from "../../shared/components/NavBar";
import GridOnIcon from "@mui/icons-material/GridOn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PortraitOutlinedIcon from "@mui/icons-material/PortraitOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import { useNavigate, useParams } from "react-router-dom";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import {
  getFriendRequestsList,
  getUserByUsername,
  removeAddFriend,
  sendAddFriend,
} from "../../services/userService";
import FriendRequest from "../../components/FriendRequest";
import { getUserPosts } from "../../services/postServices";
import ProfilePost from "../../components/Post/ProfilePost";

const cx = classNames.bind(styles);

function Profile() {
  const { user } = useAuth();
  const { username } = useParams();
  const privateHttpRequest = usePrivateHttpClient();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isSentFriendRequest, setIsSentFriendRequest] = useState(
    userData?.is_friend_request_sent
  );
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [hasMoreFriends, setHasMoreFriends] = useState(true);
  const [hasMoreFriendRequests, setHasMoreFriendRequests] = useState(true);
  const [friendRequestsPage, setFriendRequestsPage] = useState(1);
  const [friendsPage, setFriendsPage] = useState(1);

  const [userPosts, setUserPosts] = useState([]);
  const [postPage, setPostPage] = useState(1);
  const [hasMorePost, setHasMorePost] = useState(true);

  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [listType, setListType] = useState(0);
  const [unFQuestion, setUnFQuestion] = useState(false);

  const [friendButtonLoading, setFriendButtonLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profilePostsLoading, setProfilePostsLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setProfileLoading(true);
      const response = await getUserByUsername(
        username,
        privateHttpRequest.privateRequest
      );

      setUserData(response);
      const userFullname = response.full_name;
      setIsSentFriendRequest(response.is_friend_request_sent);
      // Thay đổi title khi component mount
      document.title = `${userFullname} | NestMe profile`;
      setProfileLoading(false);
    } catch (err) {
      setProfileLoading(false);
      console.log(err.message);
    }
  }, [username]);

  const getInitPosts = useCallback(async () => {
    try {
      setProfilePostsLoading(true);
      const data = await getUserPosts(
        username,
        1,
        15,
        privateHttpRequest.privateRequest
      );

      const postsCount = data.posts.length;

      if (postsCount > 0) setUserPosts(data.posts);

      setHasMorePost(postsCount > 0);
      setProfilePostsLoading(false);
    } catch (err) {
      setProfilePostsLoading(false);
      console.error("profile posts ", err);
    }
  }, [username]);

  const getFriendRequests = useCallback(async () => {
    try {
      setModalLoading(true);
      const data = await getFriendRequestsList(
        friendRequestsPage,
        20,
        privateHttpRequest.privateRequest
      );

      const recordsCount = data.friend_requests.length;

      if (recordsCount > 0)
        setFriendRequests((prev) => [...prev, ...data.friend_requests]);

      setHasMoreFriendRequests(recordsCount > 0 && recordsCount === 20);
      setModalLoading(false);
    } catch (err) {
      setModalLoading(false);
      console.error("list ", err);
    }
  }, [friendRequestsPage]);

  const setRequestDecision = useCallback((recordId, decision) => {
    // Update UI optimistically
    setFriendRequests((prev) =>
      prev.map((request) =>
        request._id === recordId ? { ...request, decision: decision } : request
      )
    );

    console.log(`Friend request ${decision}: ${recordId}`);
  }, []);

  useEffect(() => {
    fetchUser();
    getInitPosts();

    // Gỡ bỏ title khi component unmount (nếu cần)
    return () => {
      setUserPosts([]);
      document.title = "NestMe"; // Đặt lại title khi component unmount
    };
  }, [username]);

  // useEffect(() => {

  // }, [ postPage]);

  const isOwnProfile = user?.username === userData?.username;
  const isFriend = /*true;*/ userData?.is_friend;

  // useEffect(() => {
  //   console.log("own ", isOwnProfile);
  //   console.log("friend ", isFriend);
  // }, [isOwnProfile, isFriend]);

  const handleAddFriend = async () => {
    try {
      setFriendButtonLoading(true);
      const response = await sendAddFriend(
        userData._id,
        privateHttpRequest.privateRequest
      );
      if (response.message) setIsSentFriendRequest(true);
      setFriendButtonLoading(false);
    } catch (err) {
      setFriendButtonLoading(false);
      console.error(privateHttpRequest.error);
    }
  };

  const handleUnFriend = async () => {};
  const handleRemoveRequest = async () => {
    try {
      const response = await removeAddFriend(
        userData._id,
        privateHttpRequest.privateRequest
      );
      if (response.message) setIsSentFriendRequest(false);
    } catch (err) {
      console.error(privateHttpRequest.error);
    }
  };
  const handleUnfriendQuestion = async () => {
    setUnFQuestion(!unFQuestion);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const handleGetUserFriendsList = async () => {
    setListType(1);
    setModalTitle("Friends");
    toggleModal();
  };

  const handleGetUserFriendRequestsList = async () => {
    setListType(2);
    setModalTitle("Friend requests");
    if (friendRequestsPage === 1) {
      console.log("get friend requests");
      await getFriendRequests();
      setFriendRequestsPage(2);
    }
    toggleModal();
  };

  const toggleModal = () => {
    setModal(!modal);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setModalTitle("");
    }
  };

  const avatarUrl =
    userData?.profile_picture === ""
      ? "/static-resources/default-avatar.jpg"
      : userData?.profile_picture;

  return (
    !profileLoading && (
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
                  {isOwnProfile ? null : (
                    <button
                      onClick={
                        isFriend
                          ? handleUnfriendQuestion
                          : isSentFriendRequest
                          ? handleRemoveRequest
                          : handleAddFriend
                      }
                      className={
                        !isFriend && !isSentFriendRequest
                          ? cx("profile__button__blue")
                          : cx("profile__button")
                      }
                      disabled={friendButtonLoading}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {friendButtonLoading ? (
                          <CircularProgress size={15} />
                        ) : isFriend ? (
                          <>
                            Friends <ExpandMoreIcon />
                          </>
                        ) : isSentFriendRequest ? (
                          "Sent"
                        ) : (
                          "Add friend"
                        )}
                      </span>
                    </button>
                  )}
                  {isOwnProfile ? (
                    <button
                      onClick={() => navigate("/user-info/edit")}
                      className={cx("profile__button")}
                    >
                      <span>Edit profile</span>
                    </button>
                  ) : (
                    <button className={cx("profile__button")}>
                      <span>Message</span>
                    </button>
                  )}
                </div>
                <div className={cx("profile__user__2")}>
                  <span>{userData?.posts_count} Posts</span>
                  <a
                    onClick={handleGetUserFriendsList}
                    className={cx("follow")}
                  >
                    {userData?.friends_count} Friends
                  </a>
                  {isOwnProfile ? (
                    <a
                      onClick={handleGetUserFriendRequestsList}
                      className={cx("follow")}
                    >
                      {userData?.friend_requests_count} Requests
                    </a>
                  ) : null}
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
              {profilePostsLoading ? (
                <span style={{ color: "white" }}>Loading...</span>
              ) : userPosts.length === 0 ? (
                <span style={{ color: "white", fontWeight: 1000 }}>
                  No posts yet
                </span>
              ) : hasMorePost ? (
                userPosts.map((post, i) => <ProfilePost key={i} post={post} />)
              ) : null}
            </div>
          </div>
        </div>
        {unFQuestion && (
          <div className={cx("profile-modal active-profile-modal")}>
            <div
              onClick={handleUnfriendQuestion}
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

        {modal && (
          <div className={cx("profile-modal active-profile-modal")}>
            <div
              onClick={toggleModal}
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
                {modalTitle}
              </div>
              {modalLoading ? (
                <CircularProgress size={40} color="white" />
              ) : listType === 1 && friends.length > 0 ? (
                <div className={cx("profile-modal-content-users")}>
                  {friends.map((friend, i) => (
                    <FriendRequest
                      key={i}
                      listType={1}
                      myProfile={isOwnProfile}
                      item={friend}
                    />
                  ))}
                </div>
              ) : listType === 2 && friendRequests.length > 0 ? (
                <div className={cx("profile-modal-content-users")}>
                  {friendRequests.map((friendRequest, i) => (
                    <FriendRequest
                      key={i}
                      listType={2}
                      item={friendRequest}
                      decision={
                        friendRequest?.decision ? friendRequest.decision : ""
                      }
                      setRequestDecision={setRequestDecision}
                    />
                  ))}
                </div>
              ) : (
                <div className={cx("profile-modal-content-no-users")}>
                  <span>No {modalTitle}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default Profile;
