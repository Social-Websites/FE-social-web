import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Sidenav from "../../shared/components/NavBar";
import GridOnIcon from "@mui/icons-material/GridOn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PortraitOutlinedIcon from "@mui/icons-material/PortraitOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

import {
  CircularProgress,
  Skeleton,
  linearProgressClasses,
  rgbToHex,
} from "@mui/material";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import { useNavigate, useParams } from "react-router-dom";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import {
  getFriendRequestsList,
  getUserByUsername,
  getUserFriendsListByUsername,
  removeAddFriend,
  sendAddFriend,
  unFriend,
} from "../../services/userService";
import FriendRequest from "../../components/FriendRequest";
import { getUserPosts } from "../../services/postServices";
import { checkCon } from "../../services/conversationService";
import ProfilePost from "../../components/Post/ProfilePost";
import { useContext } from "react";
import { StateContext } from "../../context/StateContext";
import Error404Page from "../AuthPage/Error404Page";
import { grey } from "@mui/material/colors";

const cx = classNames.bind(styles);

function Profile() {
  const { user } = useAuth();
  const { username } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [more, setMore] = useState(false);

  const { socket, dispatch } = useContext(StateContext);
  const privateHttpRequest = usePrivateHttpClient();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isSentFriendRequest, setIsSentFriendRequest] = useState(null);
  //const [isFriend, setIsFriend] = useState(null);

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
  const [listType, setListType] = useState(0);
  const [unFQuestion, setUnFQuestion] = useState(false);

  const [friendButtonLoading, setFriendButtonLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profilePostsLoading, setProfilePostsLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  
  const observer = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (profilePostsLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMorePost) {
          console.log("Last post");
          setPostPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [profilePostsLoading, hasMorePost]
  );

  const modalItemObserver = useRef();
  const lastFriendRef = useCallback(
    (node) => {
      if (modalLoading) return;

      console.log("có observe");

      if (modalItemObserver.current) modalItemObserver.current.disconnect();

      modalItemObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreFriends) {
          console.log("Last friend");
          setFriendsPage((prev) => prev + 1);
        }
      });

      if (node) modalItemObserver.current.observe(node);
    },
    [modalLoading, hasMoreFriends]
  );

  const lastFriendRequestRef = useCallback(
    (node) => {
      if (modalLoading) return;

      console.log("có observe");

      if (modalItemObserver.current) modalItemObserver.current.disconnect();

      modalItemObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreFriendRequests) {
          console.log("Last friend request");
          setFriendRequestsPage((prev) => prev + 1);
        }
      });

      if (node) modalItemObserver.current.observe(node);
    },
    [modalLoading, hasMoreFriendRequests]
  );

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
      console.log(err);
      if (err.statusCode === 404) {
        console.log("User not found!");
        setNotFound(true);
      }
    }
  }, [username]);

  const getProfilePosts = useCallback(async () => {
    try {
      setProfilePostsLoading(true);
      const data = await getUserPosts(
        username,
        postPage,
        15,
        privateHttpRequest.privateRequest
      );

      if (data) {
        const postsCount = data.posts.length;
        setHasMorePost(postsCount > 0 && postsCount === 15);

        if (postsCount > 0 && postPage === 1) setUserPosts(data.posts);
        else setUserPosts((prev) => [...prev, ...data.posts]);
      }
      setProfilePostsLoading(false);
    } catch (err) {
      setProfilePostsLoading(false);
      console.error("profile posts ", err);
    }
  }, [username, postPage]);

  const getFriends = useCallback(async () => {
    console.log("friends load");
    try {
      setModalLoading(true);
      const data = await getUserFriendsListByUsername(
        username,
        friendsPage,
        20,
        privateHttpRequest.privateRequest
      );

      if (data) {
        const recordsCount = data.friends.length;

        setHasMoreFriends(recordsCount > 0 && recordsCount === 20);
        if (recordsCount > 0 && friends.length === 0) setFriends(data.friends);
        if (recordsCount > 0 && friends.length > 0)
          setFriends((prev) => [...prev, ...data.friends]);
      }

      setModalLoading(false);
    } catch (err) {
      setModalLoading(false);
    }
  }, [username, friendsPage]);

  const getFriendRequests = useCallback(async () => {
    console.log("friends request load");
    try {
      setModalLoading(true);
      const data = await getFriendRequestsList(
        friendRequestsPage,
        20,
        privateHttpRequest.privateRequest
      );

      if (data) {
        const recordsCount = data.friend_requests.length;

        setHasMoreFriendRequests(recordsCount > 0 && recordsCount === 20);
        if (recordsCount > 0 && friends.length === 0)
          setFriendRequests(data.friend_requests);
        if (recordsCount > 0 && friends.length > 0)
          setFriendRequests((prev) => [...prev, ...data.friend_requests]);
      }
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
  }, []);

  const setRequestSent = useCallback((recordId) => {
    // Update UI optimistically
    setFriends((prev) =>
      prev.map((friend) =>
        friend._id === recordId
          ? { ...friend, is_friend_request_sent: true }
          : friend
      )
    );
  }, []);

  useEffect(() => {
    if (notFound) setNotFound(false);
    fetchUser();

    setUserPosts([]);
    setPostPage(1);
    setHasMorePost(true);
    setFriendRequests([]);
    setFriends([]);
    setFriendsPage(1);
    setFriendRequestsPage(1);
    if (modal) toggleModal();
    // Gỡ bỏ title khi component unmount (nếu cần)
    return () => {
      document.title = "NestMe"; // Đặt lại title khi component unmount
    };
  }, [username]);

  useEffect(() => {
    getProfilePosts();
  }, [username, postPage]);

  useEffect(() => {
    if (listType === 1 && modal) getFriends();
  }, [listType, username, friendsPage, modal]);
  useEffect(() => {
    if (listType === 2 && modal) getFriendRequests();
  }, [listType, friendRequestsPage, modal]);

  const isOwnProfile = user?.username === userData?.username;

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
    } finally {
      socket.current.emit("sendNotification", {
        sender_id: user?._id,
        receiver_id: [userData._id],
        type: "request",
      });
    }
  };

  const handleUnFriend = async () => {
    if (unFQuestion) {
      handleUnfriendQuestion();
      try {
        setFriendButtonLoading(true);
        const response = await unFriend(
          userData._id,
          privateHttpRequest.privateRequest
        );
        if (response.message)
          setUserData((prev) => ({ ...prev, is_friend: false }));
        setFriendButtonLoading(false);
      } catch (err) {
        setFriendButtonLoading(false);
        console.error(privateHttpRequest.error);
      }
    }
  };
  const handleRemoveRequest = async () => {
    try {
      const response = await removeAddFriend(
        userData._id,
        privateHttpRequest.privateRequest
      );
      if (response.message) setIsSentFriendRequest(false);
    } catch (err) {
      console.error(privateHttpRequest.error);
    } finally {
      socket.current.emit("sendNotification", {
        sender_id: user?._id,
        receiver_id: [userData._id],
        type: "remove",
      });
    }
  };
  const handleUnfriendQuestion = () => {
    setUnFQuestion(!unFQuestion);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const handleGetUserFriendsList = async () => {
    setListType(1);

    toggleModal();
  };

  const handleGetUserFriendRequestsList = async () => {
    setListType(2);

    toggleModal();
  };

  const toggleModal = () => {
    setModal(!modal);
    setFriendRequests([]);
    setFriends([]);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };


  const toggleMore = () => {
    setMore(!more);
    if (!more) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const handleMessage = async () => {
    try {
      const result = await checkCon(user._id, userData._id);
      if (result) {
        dispatch({ type: "CURRENT_CHAT", payload: result });
      } else {
        const con = {
          userIds: [userData._id],
          name: userData.full_name,
          img: userData.profile_picture,
          online: false,
        };
        dispatch({ type: "CURRENT_CHAT", payload: con });
        dispatch({ type: "SET_MESSAGES", payload: [] });
        console.log("Chon conversation", con._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/chat");
    }
  };

  const avatarUrl =
    userData?.profile_picture === ""
      ? "/static-resources/default-avatar.jpg"
      : userData?.profile_picture;

  return (
    <div
      className={cx("profile")}
      style={{ backgroundColor: "black", height: "100%" }}
    >
      <div className={cx("profile__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("profile__right")} style={{ color: "white" }}>
        {/* !profileLoading && */}
        {notFound ? (
          <Error404Page notAuthPage={true} />
        ) : (
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
                        userData?.is_friend
                          ? handleUnfriendQuestion
                          : isSentFriendRequest
                          ? handleRemoveRequest
                          : handleAddFriend
                      }
                      className={
                        !userData?.is_friend && !isSentFriendRequest
                          ? cx("profile__button__blue")
                          : cx("profile__button")
                      }
                      disabled={friendButtonLoading}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {friendButtonLoading ? (
                          <CircularProgress size={15} />
                        ) : userData?.is_friend ? (
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
                    <button
                      className={cx("profile__button")}
                      onClick={handleMessage}
                    >
                      <span>Message</span>
                    </button>
                    
                  )}
                  {!isOwnProfile && <button
                      className={cx("profile__button")}
                      onClick={toggleMore}
                    >
                      <span style={{color: "#ed4956"}}>Report</span>
                    </button>}
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
                <div className={cx("profile__user__3")}>
                  <span>{userData?.user_info.bio}</span>
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
              {/* <a>
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
              </a> */}
            </div>
            <div className={cx("profile__posts")}>
              {userPosts.length > 0 ? (
                userPosts.map((post, i) => {
                  if (userPosts.length === i + 1)
                    return (
                      <ProfilePost
                        ref={lastPostRef}
                        key={i}
                        creator={userData}
                        post={post}
                      />
                    );
                  return <ProfilePost key={i} creator={userData} post={post} />;
                })
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <span style={{ color: "white", fontWeight: 1000 }}>
                    No posts yet
                  </span>
                </div>
              )}
              {profilePostsLoading && <CircularProgress size={50} />}
            </div>
          </div>
        )}
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
        <div className={cx("post-modal active-post-modal")}>
          <div
            onClick={toggleMore}
            className={cx("post-overlay")}
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
          <div className={cx("more-content")}>
            <div className={cx("more-content-header")}>
              <div className={cx("more-content-title")}>Why are you reportting this user?</div>
            </div>
            <div className={cx("more-content-report")}>Fake user</div>
            <div className={cx("more-content-report")}>False information</div>
            <div className={cx("more-content-report")}>Bullying or Harassment</div>
            <div className={cx("more-content-report")}>Spam</div>
            <div className={cx("more-content-report")} style={{color: "#ed4956"}}>Cancel</div>
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
              {listType === 1 ? "Friends" : "Friend requests"}
            </div>
            {listType === 1 && friends.length > 0 ? (
              <div className={cx("profile-modal-content-users")}>
                {friends.map((friend, i) => {
                  if (friends.length === i + 1)
                    return (
                      <FriendRequest
                        ref={lastFriendRef}
                        key={i}
                        yourId={user._id}
                        listType={1}
                        myProfile={isOwnProfile}
                        isFriend={friend?.is_your_friend ? true : false}
                        isSent={friend?.is_friend_request_sent ? true : false}
                        setIsSent={setRequestSent}
                        item={friend}
                      />
                    );
                  return (
                    <FriendRequest
                      key={i}
                      yourId={user._id}
                      listType={1}
                      myProfile={isOwnProfile}
                      isFriend={friend?.is_your_friend ? true : false}
                      isSent={friend?.is_friend_request_sent ? true : false}
                      setIsSent={setRequestSent}
                      item={friend}
                    />
                  );
                })}
              </div>
            ) : listType === 2 && friendRequests.length > 0 ? (
              <div className={cx("profile-modal-content-users")}>
                {friendRequests.map((friendRequest, i) => {
                  if (friendRequests.length === i + 1)
                    return (
                      <FriendRequest
                        ref={lastFriendRequestRef}
                        key={i}
                        listType={2}
                        item={friendRequest}
                        decision={
                          friendRequest?.decision ? friendRequest.decision : ""
                        }
                        setRequestDecision={setRequestDecision}
                      />
                    );
                  return (
                    <FriendRequest
                      key={i}
                      listType={2}
                      item={friendRequest}
                      decision={
                        friendRequest?.decision ? friendRequest.decision : ""
                      }
                      setRequestDecision={setRequestDecision}
                    />
                  );
                })}
              </div>
            ) : modalLoading ? null : (
              <div className={cx("profile-modal-content-no-users")}>
                <span>No {listType === 1 ? "friends" : "friend requests"}</span>
              </div>
            )}
            {modalLoading && (
              <>
                {friendsPage === 1 && friendRequestsPage === 1 ? (
                  <div className={cx("profile-modal-content-no-users")}>
                    <CircularProgress />
                  </div>
                ) : (
                  <CircularProgress />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
