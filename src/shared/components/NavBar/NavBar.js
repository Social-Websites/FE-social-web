import React from "react";
import { useState, useRef, useContext } from "react";
import classNames from "classnames/bind";
import styles from "./NavBar.scss";
import InstagramIcon from "@mui/icons-material/Instagram";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import { Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import WestIcon from "@mui/icons-material/West";
import { useLocation, useNavigate } from "react-router-dom";
//import { useDispatch, useSelector } from "react-redux";
// import { signOut } from "firebase/auth";
// import { logoutUser } from "../features/userSlice";
// import { auth } from "../firebase";
import { StateContext } from "../../../context/StateContext";
import useLogout from "../../hook/auth-hook/logout-hook";

const cx = classNames.bind(styles);

function NavBar() {
  //   const user = useSelector((state) => state.data.user.user);
  //   const dispatch = useDispatch();
  //   const handelLogout = () => {
  //     dispatch(logoutUser());
  //     signOut(auth);
  //   };
  const { user } = useContext(StateContext);
  const { logout } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
    setIsDropping(false);
    setImages([]);
  };
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [isTitlePost, setIsTitlePost] = useState(false);
  const fileInputRef = useRef(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [isFirstImage, setIsFirstImage] = useState(true);
  const [isLastImage, setIsLastImage] = useState(false);

  function showNextImage() {
    setImageIndex((index) => {
      if (index === images.length - 2) {
        setIsLastImage(true);
        setIsFirstImage(false);
        console.log(index);
        return images.length - 1;
      } else {
        setIsLastImage(false);
        setIsFirstImage(false);
        console.log(index);
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

  function selectFiles() {
    fileInputRef.current.click();
  }
  function onFileSelect(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!images.some((e) => e.name === files[i].name)) {
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
          },
        ]);
      }
    }
    setIsDropping(true);
    if (files.length > 1) {
      setIsLastImage(false);
    }
    else{
      setIsLastImage(true);
    }
  }

  function deleteImage(index) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageIndex((index) => {return index - 1;})
    window.alert(images.length);
    if(images.length == 1){
      setIsDropping(false);
    }
  }

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
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!images.some((e) => e.name === files[i].name)) {
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
          },
        ]);
      }
    }
    setIsDropping(true);
  }

  const handelReturnCreatPost = () => {
    setIsDropping(false);
    setImages([]);
  };

  const messageOnClick = () => {
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
        ) : (
          <div
            style={{ height: "120px", display: "flex", alignItems: "center" }}
          >
            <img
              className={cx("sidenav__logo")}
              src="https://www.pngkey.com/png/full/828-8286178_mackeys-work-needs-no-elaborate-presentation-or-distracting.png"
              alt="Instagram Logo"
            />
          </div>
        )}

        <div className={cx("sidenav__buttons")}>
          <button
            onClick={() => {
              navigate("/", { replace: true });
            }}
            className={cx("sidenav__button")}
            style={open ? { width: "71%", margin: "5px 10px 5px 10px" } : null}
          >
            <HomeOutlinedIcon
              className={cx("sidenav__icon")}
              style={{ width: "27px", height: "27px" }}
            />
            {open ? null : <span>Home</span>}
          </button>
          <button
            className={cx("sidenav__button")}
            onClick={() => setOpen(!open)}
            style={open ? { width: "71%", margin: "5px 10px 5px 10px" } : null}
          >
            <SearchIcon
              className={cx("sidenav__icon")}
              style={{ width: "27px", height: "27px" }}
            />
            {open ? null : <span>Search</span>}
          </button>
          <button
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
            onClick={signOut}
            className={cx("sidenav__button")}
            style={open ? { width: "71%", margin: "5px 10px 5px 10px" } : null}
          >
            <MovieOutlinedIcon
              className={cx("sidenav__icon")}
              style={{ width: "27px", height: "27px" }}
            />
            {open ? null : <span>Reels</span>}
          </button>
          <button
            onClick={messageOnClick}
            className={cx("sidenav__button")}
            style={open ? { width: "71%", margin: "5px 10px 5px 10px" } : null}
          >
            <ChatOutlinedIcon
              className={cx("sidenav__icon")}
              style={{ width: "27px", height: "27px" }}
            />
            {open ? null : <span>Messages</span>}
          </button>
          <button
            className={cx("sidenav__button")}
            style={open ? { width: "71%", margin: "5px 10px 5px 10px" } : null}
          >
            <FavoriteBorderIcon
              className={cx("sidenav__icon")}
              style={{ width: "27px", height: "27px" }}
            />
            {open ? null : <span>Notifications</span>}
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
            {open ? null : <span>Create</span>}
          </button>
          <button
            onClick={() => {
              navigate("/profile", { replace: true });
            }}
            className={cx("sidenav__button")}
            style={open ? { width: "75%", margin: "5px 10px 5px 10px" } : null}
          >
            <Avatar
              className={cx("sidenav__icon")}
              style={{ width: "24px", height: "24px", margin: "3px" }}
            >
              A
            </Avatar>
            {open ? null : <span>{user?.username}</span>}
          </button>
        </div>
        <div className={cx("sidenav__more")}>
          <button
            className={cx("sidenav__button")}
            style={open ? { width: "24%", margin: "5px 10px 5px 10px" } : null}
          >
            <DensityMediumOutlinedIcon
              className={cx("sidenav__icon")}
              style={{ width: "27px", height: "27px" }}
            />
            {open ? null : (
              <span className={cx("sidenav__buttonText")}>More</span>
            )}
          </button>
        </div>
      </div>
      <div style={{ marginLeft: "81px", height: "100%" }}>
        <div
          className={cx("open")}
          style={open ? { transform: "translateX(0%)" } : null}
        >
          {/* {notifications.map((n) => displayNotification(n))} */}
          <div className={cx("open__title")}>
            <span>Search</span>
          </div>
          <div className={cx("open__input")}>
            <input type="text" placeholder="Search" />
          </div>
          <div className={cx("open__content")} style={{ paddingTop: "12px" }}>
            <span> Recent </span>
            <div className={cx("open__user")}>
              <span className={cx("open__user_avatar")}>
                <Avatar>R</Avatar>
              </span>
              <div className={cx("open__user__info")}>
                <span className={cx("open__username")}>redian_</span>
                <span className={cx("open__relation")}>New to Instagram</span>
              </div>
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
                    onClick={()=>handelReturnCreatPost()}
                  />
                </div>
                <div style={{ width: "86%" }}>Create new post</div>
                <span className={cx("header-next")} style={{ width: "7%" }}>
                  Create
                </span>
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
                    {images.map((images, index) => (
                      <div 
                        classname={cx("img-slider")}  
                        style={{
                          width: "100%",
                          transform: `translateX(-${100 * imageIndex}%)`,
                          transition: "transform 0.2s",
                          display: "flex",
                          flexShrink: "0",
                          flexGrow: "0",
                          borderRadius: "0px 0px 0px 10px",
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
                          borderRadius: "0px 0px 10px 10px",
                        }}
                          src={images.url}
                          alt={images.name}
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
                            color: "white",
                            borderRadius: "50%",
                            padding: "6px",
                            width: "18px", height: "18px", marginBottom: "2px"
                          }}
                          onClick={() => deleteImage(index)}
                        />
                        {isFirstImage === true || images.length == 1 ? null : (
                          <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <button
                              onClick={showPrevImage}
                              className={cx("img-slider-btn")}
                              style={{ left: 10 }}
                              aria-label="View Previous Image"
                            >
                              <ArrowBackIosNewIcon style={{ width: "16px", height: "16px", marginBottom: "2px" }} aria-hidden />
                            </button>
                          </div>
                        )}
                        {isLastImage === true ? null : (
                          <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <button
                              onClick={showNextImage}
                              className={cx("img-slider-btn")}
                              style={{ right: 10 }}
                              aria-label="View Next Image"
                            >
                              <ArrowForwardIosIcon style={{ width: "16px", height: "16px", marginBottom: "2px" }} aria-hidden />
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
                                style={{width: "28px",height: "28px"}}
                                src={user?.profile_picture}
                                alt=""
                            />
                        </div>
                        <div className={cx("postInfo__user__info")}>
                            <span className={cx("postInfo__username")}>{user?.username}</span>
                        </div>
                      </div>
                      <div className={cx("post__text")}>
                        <textarea placeholder="Write a caption..."></textarea>
                      </div>
                      <SentimentSatisfiedAltIcon type="submit" style={{color: "#737373", padding: "0px 8px", margin: "4px 8px", width: "24px", cursor: "pointer"}} />
                    </div>
                  </div>
              </div>
            </div>
          ) : (
            <div className={cx("modal-content")} style={{width: "50%"}}>
              <div className={cx("modal-header")}>Create new post</div>
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
                      Select from computer
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
