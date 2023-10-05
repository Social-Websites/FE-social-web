import React from "react";
import { Avatar } from "@mui/material";
import classNames from 'classnames/bind';
import styles from "./Profile.scss";
import Sidenav from "../../components/NavBar";
import GridOnIcon from '@mui/icons-material/GridOn';
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PortraitOutlinedIcon from '@mui/icons-material/PortraitOutlined';

const cx = classNames.bind(styles);

function Profile() {
  return (
    <div className={cx("profile")} style={{backgroundColor: "black"}}>
      <div className={cx("profile__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("profile__right")}>
        <div className={cx("profile__content")}>
          <div className={cx("profile__header")}>
            <div className={cx("profile_avatar")}>
              <Avatar className={cx("avatar")}>R</Avatar>
            </div>
            <div className={cx("profile__info")}>
              <div className={cx("profile__user")}> 
                <span>redian_</span>
                <button className={cx("profile__button")}>
                  <span>Edit Profile</span>
                </button>
                <button className={cx("profile__button")}>
                  <span>View Archive</span>
                </button>
              </div>
              <div className={cx("profile__user__2")}>  
                <span>0 posts</span>
                <a className={cx("follow")}>38 follower</a>
                <a className={cx("follow")}>38 following</a>
              </div>
              <div className={cx("profile__user__3")}> 
                <span>Nguyen Khac Duong</span>
              </div>
            </div>
          </div>

          <div className={cx("profile__post")}>
            <a >
              <div className={cx("choose")}>
                <GridOnIcon className={cx("icon")}/> 
                <span className={cx("span")}>POSTS</span>
              </div>   
            </a>
            <a >
              <div className={cx("choose")}>
                <BookmarkBorderIcon className={cx("icon")}/> 
                <span className={cx("span")}>SAVED</span>
              </div>   
            </a>
            <a>
              <div className={cx("choose")} style={{marginRight: "0px"}}>
                <PortraitOutlinedIcon className={cx("icon")}/> 
                <span className={cx("span")}>TAGGED</span>
              </div>   
            </a>
          </div>

          <div className={cx("profile__post")}>
            <a >
              <div className={cx("choose")}>
                <GridOnIcon className={cx("icon")}/> 
                <span className={cx("span")}>POSTS</span>
              </div>   
            </a>
            <a >
              <div className={cx("choose")}>
                <BookmarkBorderIcon className={cx("icon")}/> 
                <span className={cx("span")}>SAVED</span>
              </div>   
            </a>
            <a>
              <div className={cx("choose")} style={{marginRight: "0px"}}>
                <PortraitOutlinedIcon className={cx("icon")}/> 
                <span className={cx("span")}>TAGGED</span>
              </div>   
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;