import React from "react";
import { useEffect, useState } from "react";
import classNames from 'classnames/bind';
import styles from "./NavBar.scss";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from "@mui/icons-material/Search";
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DensityMediumOutlinedIcon from '@mui/icons-material/DensityMediumOutlined';
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
  const [open, setOpen] = useState(false);
  return (
    <div style={{display:"flex"}}>
      <div className={cx("sidenav")}>
        <img
          className={cx("sidenav__logo")}
          src="https://www.pngkey.com/png/full/828-8286178_mackeys-work-needs-no-elaborate-presentation-or-distracting.png"
          alt="Instagram Logo"
        />

        <div className={cx("sidenav__buttons")}>
          <button className={cx("sidenav__button")}>
            <HomeOutlinedIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
            <span>Home</span>
          </button>
          <button className={cx("sidenav__button")} onClick={() => setOpen(!open)}>
            <SearchIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
            <span>Search</span>
          </button>
          <button className={cx("sidenav__button")}>
            <ExploreOutlinedIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
            <span>Explore</span>
          </button>
          <button className={cx("sidenav__button")}>
            <MovieOutlinedIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
            <span>Reels</span>
          </button>
          <button className={cx("sidenav__button")}>
            <ChatOutlinedIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
            <span>Messages</span>
          </button>
          <button className={cx("sidenav__button")}>
            <FavoriteBorderIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
            <span>Notifications</span>
          </button>
          <button className={cx("sidenav__button")}>
            <AddCircleOutlineIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
            <span>Create</span>
          </button>
          <button className={cx("sidenav__button")}>
            <Avatar className={cx("sidenav__icon")} style={{width: "24px",height: "24px", margin: "3px"}}>
              A
            </Avatar>
            <span>
              Duongw 
            </span>
          </button>
        </div>
        <div className={cx("sidenav__more")}>
          <button className={cx("sidenav__button")}>
            <DensityMediumOutlinedIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
            <span className={cx("sidenav__buttonText")}>More</span>
          </button>
        </div>
      </div>
      <div style={{marginLeft:"241px", height: "100%"}}>
        {open && (
          <div className={cx("open")}>
            {/* {notifications.map((n) => displayNotification(n))} */}
            <div className={cx("open__title")}>
              <span >Search</span>
            </div>
            <div className={cx("open__input")}>
              <input type="text"  placeholder="Search"/>
            </div>
            <div className={cx("open__content")} style={{color: "white", margin: "12px 24px 8px 24px", fontWeight: "600"}}>
              Recent
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;