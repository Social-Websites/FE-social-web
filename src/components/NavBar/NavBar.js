import React from "react";
import classNames from 'classnames/bind';
import styles from "./NavBar.scss";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar } from "@mui/material";
//import { useDispatch, useSelector } from "react-redux";
// import { signOut } from "firebase/auth";
// import { logoutUser } from "../features/userSlice";
// import { auth } from "../firebase";

const cx = classNames.bind(styles)

function NavBar() {
//   const user = useSelector((state) => state.data.user.user);
//   const dispatch = useDispatch();
//   const handelLogout = () => {
//     dispatch(logoutUser());
//     signOut(auth);
//   };
  return (
    <div className={cx("sidenav")}>
      <img
        className={cx("sidenav__logo")}
        src="https://www.pngkey.com/png/full/828-8286178_mackeys-work-needs-no-elaborate-presentation-or-distracting.png"
        alt="Instagram Logo"
      />

      <div className={cx("sidenav__buttons")}>
        <button className={cx("sidenav__button")}>
          <HomeIcon style={{width: "27px",height: "27px"}}/>
          <span>Home</span>
        </button>
        <button className={cx("sidenav__button")}>
          <SearchIcon style={{width: "27px",height: "27px"}}/>
          <span>Search</span>
        </button>
        <button className={cx("sidenav__button")}>
          <ExploreIcon style={{width: "27px",height: "27px"}}/>
          <span>Explore</span>
        </button>
        <button className={cx("sidenav__button")}>
          <SlideshowIcon style={{width: "27px",height: "27px"}}/>
          <span>Reels</span>
        </button>
        <button className={cx("sidenav__button")}>
          <ChatIcon style={{width: "27px",height: "27px"}}/>
          <span>Messages</span>
        </button>
        <button className={cx("sidenav__button")}>
          <FavoriteBorderIcon style={{width: "27px",height: "27px"}}/>
          <span>Notifications</span>
        </button>
        <button className={cx("sidenav__button")}>
          <AddCircleOutlineIcon style={{width: "27px",height: "27px"}}/>
          <span>Create</span>
        </button>
        <button className={cx("sidenav__button")}>
          <Avatar style={{width: "24px",height: "24px", margin: "3px"}}>
            A
          </Avatar>
          <span>
            Duongw 
          </span>
        </button>
      </div>
      <div className={cx("sidenav__more")}>
        <button className={cx("sidenav__button")}>
          <MenuIcon style={{width: "30px",height: "30px"}}/>
          <span className={cx("sidenav__buttonText")}>More</span>
        </button>
      </div>
    </div>
  );
}

export default NavBar;