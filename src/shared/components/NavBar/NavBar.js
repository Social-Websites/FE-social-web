import React, { useEffect } from "react";
import { useState, useRef, useContext } from "react";
import classNames from "classnames/bind";
import styles from "./NavBar.scss";
import InstagramIcon from "@mui/icons-material/Instagram";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import { Avatar, CircularProgress } from "@mui/material";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import EmojiPicker from "emoji-picker-react";
import CloseIcon from "@mui/icons-material/Close";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import WestIcon from "@mui/icons-material/West";
import { useLocation, useNavigate } from "react-router-dom";
import { StateContext } from "../../../context/StateContext";
import useLogout from "../../hook/auth-hook/logout-hook";
import {
  getDownloadURL,
  ref,
  storage,
  uploadBytesResumable,
} from "../../../config/firebase";
import usePrivateHttpClient from "../../hook/http-hook/private-http-hook";
import { createPost } from "../../../services/postServices";
import * as usersService from "../../../services/userService";
import SearchUser from "../../../components/SearchUser";
import SearchUserLoading from "../../../components/SearchUserLoading";
import Notification from "../../../components/NotificationItem";
import { addCreatedPost, setPosts } from "../../../context/StateAction";
import * as notificationsService from "../../../services/notificationService";
import { io } from "socket.io-client";
import getAvatarUrl from "../../util/getAvatarUrl";
import * as conversationService from "../../../services/conversationService";

const cx = classNames.bind(styles);

function NavBar({ onScrollToTop }) {
  //   const user = useSelector((state) => state.data.user.user);
  //   const dispatch = useDispatch();
  //   const handelLogout = () => {
  //     dispatch(logoutUser());
  //     signOut(auth);
  //   };

  const privateHttpClient = usePrivateHttpClient();
  const [creatingPost, setCreatingPost] = useState(false);
  const socket = useRef();
  const { user, dispatch } = useContext(StateContext);
  const { logout } = useLogout();
  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const locate = window.location.pathname;

  const [currentTitle, setCurrentTitle] = useState(document.title);

  const [open, setOpen] = useState("");
  const [more, setMore] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const scrollRef = useRef(null);
  const [loadMore, setLoadMore] = useState(false);
  const [conversationUnread, setConversationUnread] = useState([]);
  const [unreadMsg, setUnreadMsg] = useState(0);
  const [unreadNotification, setUnreadNotification] = useState(0);
  const [notification, setNotification] = useState([]);

  const avatarUrl = getAvatarUrl(user?.profile_picture);

  const toggleModal = () => {
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
      document.title = "Create new post | NestMe";
    } else {
      document.body.style.overflow = "auto";
      document.title = currentTitle;
    }
    setModal(!modal);
    setIsDropping(false);
    setImages([]);
  };

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [isTitlePost, setIsTitlePost] = useState(false);
  const [titlePost, setTitlePost] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [isFirstImage, setIsFirstImage] = useState(true);
  const [isLastImage, setIsLastImage] = useState(false);

  useEffect(() => {
    if (user) {
      if (socket.current == null) {
        socket.current = io("http://localhost:5000");
        console.log(socket);
        socket.current.on("connect", () => {
          // yêu cầu kết nối vào 1 socket mới
          console.log(`You connected with socket`, Date().split("G")[0]);
        }); // sự kiện mở kết nối socket
        socket.current.emit("add-user", user._id);
        dispatch({ type: "SET_SOCKET", payload: socket });
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (notification) {
          console.log(user?._id);
          const data = await notificationsService.getNotifications(
            user?._id,
            0
          );
          const unreadCount = data.filter((notification) => !notification.read);
          setUnreadNotification(unreadCount.length);
          setNotification(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (user) {
      let unread;
      const fetchData = async () => {
        try {
          const data = await conversationService.getUserConversations(user._id);
          unread = data.filter((item) => item.unread === true);
          setConversationUnread(unread);
          setUnreadMsg(unread.length);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const handleGetMsgNotification = async (data) => {
      console.log("Nhận được message:", data);
      console.log(conversationUnread);
      console.log(
        conversationUnread.find((con) => con._id === data.conversationId)
      );
      if (!conversationUnread.find((con) => con._id === data.conversationId)) {
        console.log("toi day chua");
        setConversationUnread((prevCon) => [
          ...prevCon,
          { _id: data.conversationId },
        ]);
        setUnreadMsg((prevCount) => prevCount + 1);
      }
    };

    socket.current?.on("msg-recieve", handleGetMsgNotification);

    return () => {
      // Hủy đăng ký sự kiện khi component unmount
      socket.current?.off("msg-recieve", handleGetMsgNotification);
    };
  }, [socket.current, conversationUnread]);

  useEffect(() => {
    const handleGetNotification = async (data) => {
      console.log("Nhận được thông báo:", data);
      console.log("open:", open);
      setNotification((prevNotifications) => [data, ...prevNotifications]);
      if (open !== "Notification")
        setUnreadNotification((prevCount) => prevCount + 1);
      else {
        try {
          const result = await notificationsService.addReader();
          if (result !== null) {
            setUnreadNotification(0);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    socket.current?.on("getNotification", handleGetNotification);

    return () => {
      // Hủy đăng ký sự kiện khi component unmount
      socket.current?.off("getNotification", handleGetNotification);
    };
  }, [socket.current, open === "Notification"]);

  useEffect(() => {
    if (locate !== "/chat") {
      dispatch({ type: "CURRENT_CHAT", payload: null });
    }
  }, [locate]);

  useEffect(() => {
    let isFetching = false;
    const handleScroll = async () => {
      const element = scrollRef.current;
      if (
        !isFetching &&
        Math.floor(element.scrollTop + element.clientHeight) ===
          element.scrollHeight - 1
      ) {
        console.log("Đã đạt đến cuoi" + notification.length + user._id);
        try {
          setLoadMore(true);
          isFetching = true;
          const data = await notificationsService.getNotifications(
            user._id,
            notification.length
          );
          console.log("notification" + data);
          setNotification((prevdata) => [...prevdata, ...data]);
        } catch (error) {
          setLoadMore(false);
          console.log("Lỗi:", error);
        } finally {
          isFetching = false;
          setLoadMore(false);
        }
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [notification, user]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setEmojiPicker(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleEmojiModal = () => {
    setEmojiPicker(!emojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setTitlePost((prevText) => (prevText += emoji.emoji));
  };
  const handleSearch = () => {
    if (open !== "") {
      if (open !== "Search") setOpen("Search");
      else setOpen("");
    } else setOpen("Search");
  };
  const handleNotification = async () => {
    if (unreadNotification !== 0) {
      try {
        const result = await notificationsService.addReader();
        if (result !== null) {
          setUnreadNotification(0);
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (open !== "") {
      if (open !== "Notification") setOpen("Notification");
      else setOpen("");
    } else setOpen("Notification");
  };

  const searchUsers = async (e) => {
    const data = e.target.value;
    try {
      const result = await usersService.searchUsers(data);
      console.log(result);
      if (result !== null) {
        setSearchedUsers(result);
        setIsLoadingSearch(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const debounce = (fn, delay) => {
    let timerId = null;

    return function (...args) {
      setIsLoadingSearch(true);
      clearTimeout(timerId);

      timerId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };
  const debouncedSearchUsers = debounce(searchUsers, 500);

  function showNextImage() {
    setImageIndex((index) => {
      if (index === images.length - 2) {
        setIsLastImage(true);
        setIsFirstImage(false);
        return images.length - 1;
      } else {
        setIsLastImage(false);
        setIsFirstImage(false);
        return index + 1;
      }
    });
  }

  function showPrevImage() {
    setImageIndex((index) => {
      if (index === 1) {
        setIsLastImage(false);
        setIsFirstImage(true);
        console.log(index);
        return 0;
      } else {
        setIsLastImage(false);
        setIsFirstImage(false);
        console.log(index);
        return index - 1;
      }
    });
  }

  //Validate file
  const notValidFile = (file) => {
    //image/jpg,image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm
    return (
      file.type !== "image/jpg" &&
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/gif" &&
      file.type !== "image/webp" &&
      file.type !== "video/mp4" &&
      file.type !== "video/webm"
    );
  };

  function selectFiles() {
    fileInputRef.current.click();
  }
  function onFileSelect(event) {
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
    setIsDropping(true);
    if (files.length > 1) {
      setIsLastImage(false);
    } else {
      setIsLastImage(true);
      setIsFirstImage(true);
    }
  }

  function deleteImage(index) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageIndex((index) => {
      return index - 1;
    });

    if (images.length === 1) {
      setIsDropping(false);
      setImageIndex(0);
      setImages([]);
    }

    if (index === 1) {
      setIsFirstImage(true);
    }
    if (images.length === 2) {
      setIsLastImage(true);
    }
  }

  //Kéo thả ảnh vào phần tạo bài viết
  function onDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }
  function onDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }
  function onDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
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
    setIsDropping(true);
    if (files.length > 1) {
      setIsLastImage(false);
      setIsFirstImage(true);
    } else {
      setIsLastImage(true);
      setIsFirstImage(true);
    }
  }

  const handelReturnCreatePost = () => {
    setIsDropping(false);
    setImages([]);
  };

  const handleCreatePost = async () => {
    setCreatingPost(true);
    const promises = images.map((image) => {
      const name = Date.now();
      const storageRef = ref(storage, `images/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, image.file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.log(error);
            reject(error);
            setCreatingPost(false);
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
    });
    let createdPostId;
    try {
      const urls = await Promise.allSettled(promises);
      const urlStrings = urls.map((url) => url.value.toString());

      const postData = { title: titlePost, urlStrings };
      const response = await createPost(
        postData,
        privateHttpClient.privateRequest
      );

      if (response !== null) {
        createdPostId = response.post._id;
        console.log(response.post);
        dispatch(
          addCreatedPost({
            ...response.post,
            is_user_liked: false,
            reacts_count: 0,
            comments_count: 0,
          })
        );
        toggleModal();
        setTitlePost("");
        setCreatingPost(false);
        onScrollToTop();
      }
    } catch (err) {
      setCreatingPost(false);
      console.log(err);
    } finally {
      socket.current.emit("sendNotification", {
        sender_id: user?._id,
        receiver_id: user?.friends,
        content_id: createdPostId,
        type: "post",
      });
    }
  };

  const messageOnClick = () => {
    setUnreadMsg((prevCount) => (prevCount = 0));
    navigate("/chat", { replace: true });
  };

  const signOut = async () => {
    await logout();

    navigate("/accounts/login");
  };

  return (
    <div style={{ display: "flex" }}>
      <div className={cx("sidenav")} style={open ? { width: "80px" } : null}>
        {open ? (
          <div
            style={{
              height: "120px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              className={cx("sidenav__button")}
              onClick={() => {
                navigate("/", { replace: true });
              }}
              style={
                open ? { width: "71%", margin: "5px 13px 8px 10px" } : null
              }
            >
              <InstagramIcon
                className={cx("sidenav__icon")}
                style={{ width: "27px", height: "27px" }}
              />
            </button>
          </div>
        ) : (
          <div className={cx("sidenav__title")}>
            <img
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/", { replace: true });
              }}
              className={cx("sidenav__logo")}
              src="https://www.pngkey.com/png/full/828-8286178_mackeys-work-needs-no-elaborate-presentation-or-distracting.png"
              alt="Instagram Logo"
            />
            <button
              onClick={() => {
                navigate("/", { replace: true });
              }}
              className={cx("sidenav__button sidenav__title__button")}
              style={
                open ? { width: "71%", margin: "5px 10px 5px 10px" } : null
              }
            >
              <InstagramIcon
                className={cx("sidenav__icon")}
                style={{ width: "27px", height: "27px" }}
              />
            </button>
          </div>
        )}

        <div className={cx("sidenav__buttons")}>
          <button
            onClick={() => {
              navigate("/", { replace: true });
            }}
            className={cx("sidenav__button")}
            style={
              open
                ? { width: "71%", margin: "5px 10px 5px 10px" }
                : locate === "/"
                ? { background: "#262626" }
                : null
            }
          >
            {locate === "/" ? (
              <HomeIcon
                className={cx("sidenav__icon")}
                style={{ width: "27px", height: "27px" }}
              />
            ) : (
              <HomeOutlinedIcon
                className={cx("sidenav__icon")}
                style={{ width: "27px", height: "27px" }}
              />
            )}
            {open ? null : (
              <span className={cx("span")} style={{ fontWeight: 800 }}>
                Home
              </span>
            )}
          </button>
          <button
            className={cx("sidenav__button")}
            onClick={handleSearch}
            style={Object.assign(
              {},
              open ? { width: "71%", margin: "5px 10px 5px 10px" } : {},
              open === "Search" ? { background: "#262626" } : {}
            )}
          >
            <SearchIcon
              className={cx("sidenav__icon")}
              style={{ width: "27px", height: "27px", fontWeight: "900" }}
            />
            {open ? null : <span className={cx("span")}>Search</span>}
          </button>
          {/* <button
            onClick={() => {
              navigate("/group", { replace: true });
            }}
            className={cx("sidenav__button")}
            style={open ? { width: "71%", margin: "5px 10px 5px 10px" } : null}
          >
            <ExploreOutlinedIcon
              className={cx("sidenav__icon")}
              style={{ width: "27px", height: "27px" }}
            />
            {open ? null : <span>Explore</span>}
          </button>
          <button
            className={cx("sidenav__button")}
            style={open ? { width: "71%", margin: "5px 10px 5px 10px" } : null}
          >
            <MovieOutlinedIcon
              className={cx("sidenav__icon")}
              style={{ width: "27px", height: "27px" }}
            />
            {open ? null : <span>Reels</span>}
          </button> */}
          <button
            onClick={messageOnClick}
            className={cx("sidenav__button")}
            style={
              open
                ? { width: "71%", margin: "5px 10px 5px 10px" }
                : locate === "/chat"
                ? { background: "#262626" }
                : null
            }
          >
            {locate === "/chat" ? (
              <ChatIcon
                className={cx("sidenav__icon")}
                style={{ width: "27px", height: "27px" }}
              />
            ) : (
              <ChatOutlinedIcon
                className={cx("sidenav__icon")}
                style={{ width: "27px", height: "27px" }}
              />
            )}
            {locate !== "/chat" && unreadMsg > 0 && (
              <span
                className={cx("unread")}
                style={open ? { left: "20px" } : null}
              >
                {unreadMsg > 5 ? "5+" : unreadMsg}
              </span>
            )}
            {open ? null : <span className={cx("span")}>Messages</span>}
          </button>
          <button
            onClick={handleNotification}
            className={cx("sidenav__button")}
            style={Object.assign(
              {},
              open ? { width: "71%", margin: "5px 10px 5px 10px" } : {},
              open === "Notification" ? { background: "#262626" } : {}
            )}
          >
            {open === "Notification" ? (
              <FavoriteIcon
                className={cx("sidenav__icon")}
                style={{ width: "27px", height: "27px" }}
              />
            ) : (
              <FavoriteBorderIcon
                className={cx("sidenav__icon")}
                style={{ width: "27px", height: "27px" }}
              />
            )}
            {unreadNotification > 0 && (
              <span
                className={cx("unread")}
                style={open ? { left: "20px" } : null}
              >
                {unreadNotification > 5 ? "5+" : unreadNotification}
              </span>
            )}
            {open ? null : <span className={cx("span")}>Notifications</span>}
          </button>
          <button
            className={cx("sidenav__button")}
            onClick={toggleModal}
            style={open ? { width: "71%", margin: "5px 10px 5px 10px" } : null}
          >
            <AddBoxOutlinedIcon
              className={cx("sidenav__icon")}
              style={{ width: "27px", height: "27px" }}
            />
            {open ? null : <span className={cx("span")}>Create</span>}
          </button>
          <button
            onClick={() => {
              navigate(`/${user?.username}`, { replace: true });
            }}
            className={cx("sidenav__button")}
            style={
              open
                ? { width: "75%", margin: "5px 10px 5px 10px" }
                : locate === `/${user?.username}`
                ? { background: "#262626" }
                : null
            }
          >
            <img
              style={{ width: "25px", height: "25px", borderRadius: "50%" }}
              src={avatarUrl}
              alt=""
            />
            {open ? null : <span className={cx("span")}>Profile</span>}
          </button>
        </div>
        <div className={cx("sidenav__more")}>
          <div
            style={{
              display: "inline-block",
              position: "relative",
              width: "100%",
            }}
          >
            {more && (
              <div style={{ position: "absolute", bottom: 140, left: 10 }}>
                <div className={cx("sidenav__more-content")}>
                  <div className={cx("sidenav__more-element")}>Setting</div>
                  <div className={cx("sidenav__more-element")}>
                    Your Profile
                  </div>
                  <div
                    className={cx("sidenav__more-element")}
                    style={{ color: "#ed4956" }}
                    onClick={signOut}
                  >
                    Log out
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            className={cx("sidenav__button")}
            style={open ? { width: "24%", margin: "5px 10px 5px 10px" } : null}
            onClick={() => {
              setMore(!more);
            }}
          >
            <DensityMediumOutlinedIcon
              className={cx("sidenav__icon")}
              style={{ width: "27px", height: "27px" }}
            />
            {open ? null : (
              <span className={cx("sidenav__buttonText span")}>More</span>
            )}
          </button>
        </div>
      </div>
      <div style={{ marginLeft: "81px", height: "100%" }}>
        <div
          className={cx("open")}
          style={open === "Search" ? { transform: "translateX(0%)" } : null}
        >
          <div className={cx("open__title")}>
            <span>Search</span>
          </div>
          <div className={cx("open__input")}>
            <input
              type="text"
              onChange={debouncedSearchUsers}
              placeholder="Search"
            />
          </div>
          <div className={cx("open__content")} style={{ paddingTop: "12px" }}>
            {isLoadingSearch ? (
              <SearchUserLoading />
            ) : (
              <div>
                {searchedUsers.length === 0 ? (
                  <div
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      height: "90%",
                    }}
                  >
                    <span className={cx("open__content__span")}>
                      No search results found
                    </span>
                  </div>
                ) : (
                  <div>
                    {searchedUsers.map((u) => (
                      <SearchUser u={u} key={u._id} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div
          className={cx("open")}
          style={
            open === "Notification" ? { transform: "translateX(0%)" } : null
          }
        >
          <div className={cx("open__title")} style={{ padding: "12px 24px" }}>
            <span>Notifications</span>
          </div>
          <div
            className={cx("open__content")}
            style={{ paddingTop: "12px" }}
            ref={scrollRef}
          >
            {notification.map((n) => (
              <Notification key={n._id} n={n} />
            ))}
            <div style={{ justifyContent: "center", display: "flex" }}>
              {loadMore ? (
                <DonutLargeIcon
                  className={loadMore ? cx("loading-icon") : null}
                  style={{
                    color: "#A8A8A8",
                    marginTop: "5px",
                    marginBottom: "10px",
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div
          className={cx("modal active-modal")}
          onDragOver={isDropping ? null : onDragOver}
          onDragLeave={isDropping ? null : onDragLeave}
          onDrop={isDropping ? null : onDrop}
        >
          <div
            onClick={toggleModal}
            className={cx("overlay")}
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
          {isDropping ? (
            <div className={cx("modal-content")} style={{ height: "auto" }}>
              <div className={cx("modal-header")} style={{ display: "flex" }}>
                <div style={{ width: "7%", height: "22.4px" }}>
                  <WestIcon
                    className={cx("sidenav__icon")}
                    style={{ width: "27px", height: "27px", cursor: "pointer" }}
                    onClick={() => handelReturnCreatePost()}
                  />
                </div>
                <div style={{ width: "86%" }}>New Post</div>
                {!creatingPost ? (
                  <span
                    onClick={handleCreatePost}
                    className={cx("header-next")}
                    style={{ width: "7%" }}
                  >
                    Create
                  </span>
                ) : (
                  <CircularProgress size={20} />
                )}
              </div>
              <div
                className={cx("modal-main")}
                style={isDragging ? { backgroundColor: "black" } : null}
              >
                <div
                  className={cx("container")}
                  style={{
                    width: "100%",
                    borderRadius: "0px 0px 10px 10px",
                    display: "flex",
                    backgroundColor: "black",
                  }}
                >
                  <div
                    className={cx("image")}
                    style={{
                      width: "100%",
                      display: "flex",
                      overflow: "hidden",
                    }}
                  >
                    {images.map((image, index) => (
                      <div
                        className={cx("img-slider")}
                        style={{
                          width: "100%",
                          transform: `translateX(-${100 * imageIndex}%)`,
                          transition: "transform 0.2s",
                          display: "flex",
                          flexShrink: "0",
                          flexGrow: "0",
                          borderRadius: "0px 0px 10px 10px",
                        }}
                        aria-hidden={imageIndex !== index}
                      >
                        <img
                          style={{
                            width: "100%",
                            objectFit: "contain",
                            height: "auto",
                            display: "block",
                            flexShrink: "0",
                            flexGrow: "0",
                            borderRadius: "0px 0px 0px 10px",
                          }}
                          src={image.url}
                          alt={image.name}
                        />
                        <CloseIcon
                          className={cx("sidenav__icon delete_image")}
                          style={{
                            color: "white",
                            margin: "12px 15px",
                            position: "absolute",
                            right: "0",
                            top: 0,
                            cursor: "pointer",
                            backgroundColor: "#464646",
                            borderRadius: "50%",
                            padding: "6px",
                            width: "18px",
                            height: "18px",
                            marginBottom: "2px",
                          }}
                          onClick={() => deleteImage(index)}
                        />
                        {isFirstImage === true || images.length === 1 ? null : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <button
                              onClick={showPrevImage}
                              className={cx("img-slider-btn")}
                              style={{ left: 10 }}
                              aria-label="View Previous Image"
                            >
                              <ArrowBackIosNewIcon
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  marginBottom: "2px",
                                }}
                                aria-hidden
                              />
                            </button>
                          </div>
                        )}
                        {isLastImage === true ? null : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <button
                              onClick={showNextImage}
                              className={cx("img-slider-btn")}
                              style={{ right: 10 }}
                              aria-label="View Next Image"
                            >
                              <ArrowForwardIosIcon
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  marginBottom: "2px",
                                }}
                                aria-hidden
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={cx("post__caption")}>
                    <div className={cx("postInfo__user")}>
                      <div className={cx("postInfo__user_avatar")}>
                        <img
                          style={{ width: "28px", height: "28px" }}
                          src={avatarUrl}
                          alt=""
                        />
                      </div>
                      <div className={cx("postInfo__user__info")}>
                        <span className={cx("postInfo__username")}>
                          {user?.username}
                        </span>
                      </div>
                    </div>

                    <div className={cx("post__text")}>
                      <textarea
                        value={titlePost}
                        onChange={(e) => setTitlePost(e.target.value)}
                        placeholder="Tiêu đề bài viết..."
                      ></textarea>
                    </div>
                    <div
                      className={cx("input")}
                      style={{ background: "#262626" }}
                      id="emoji-open"
                      ref={emojiPickerRef}
                    >
                      <SentimentSatisfiedAltIcon
                        type="submit"
                        style={{
                          color: "#737373",
                          padding: "0px 8px",
                          margin: "4px 8px",
                          width: "24px",
                          cursor: "pointer",
                        }}
                        onClick={handleEmojiModal}
                      />
                      {emojiPicker && (
                        <div style={{ position: "absolute", bottom: 10 }}>
                          <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            theme="dark"
                            emojiStyle="native"
                            searchDisabled={true}
                            width={330}
                            height={350}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={cx("modal-content")} style={{ width: "50%" }}>
              <div className={cx("modal-header")}>New Post</div>
              <div
                className={cx("modal-main")}
                style={isDragging ? { backgroundColor: "black" } : null}
              >
                <div>
                  <div className={cx("modal-image")}>
                    <CollectionsOutlinedIcon className={cx("modal-logo")} />
                  </div>
                  {isDragging ? (
                    <div className={cx("modal-text")}>
                      Drop photos and videos here
                    </div>
                  ) : (
                    <div className={cx("modal-text")}>
                      Drag photos and videos here
                    </div>
                  )}

                  <div className={cx("modal-input")}>
                    <input
                      type="file"
                      accept="image/jpg,image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                      multiple
                      ref={fileInputRef}
                      onChange={onFileSelect}
                      id="myFileInput"
                      style={{ display: "none" }}
                    />
                    <label
                      role="button"
                      onClick={selectFiles}
                      className={cx("modal-upload")}
                    >
                      Select from device
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NavBar;
