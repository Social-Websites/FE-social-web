import React from "react";
import { useState, useRef } from "react";
import classNames from 'classnames/bind';
import styles from "./NavBarMini.module.scss";
import InstagramIcon from '@mui/icons-material/Instagram';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from "@mui/icons-material/Search";
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DensityMediumOutlinedIcon from '@mui/icons-material/DensityMediumOutlined';
import { Avatar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import WestIcon from '@mui/icons-material/West';
//import { useDispatch, useSelector } from "react-redux";
// import { signOut } from "firebase/auth";
// import { logoutUser } from "../features/userSlice";
// import { auth } from "../firebase";

const cx = classNames.bind(styles)

function NavBarMini() {
//   const user = useSelector((state) => state.data.user.user);
//   const dispatch = useDispatch();
//   const handelLogout = () => {
//     dispatch(logoutUser());
//     signOut(auth);
//   };
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
  const fileInputRef = useRef(null);
  const [imageIndex, setImageIndex] = useState(0)
  const [isFirstImage, setIsFirstImage] = useState(true)
  const [isLastImage, setIsLastImage] = useState(false)

  function showNextImage() {
    setImageIndex(index => {
      if (index === images.length - 1) {
        setIsLastImage(true);
        setIsFirstImage(false);
        return 0;
      }
      else {
        setIsLastImage(false);
        setIsFirstImage(false);
      }
      return index + 1
    })
  }

  function showPrevImage() {
    setImageIndex(index => {
      if (index === 0) {
        setIsLastImage(false);
        setIsFirstImage(true)
        return images.length - 1
      }
      else {
        setIsLastImage(false);
        setIsFirstImage(false);
      }
      return index - 1
    })
  }

  function selectFiles() { 
    fileInputRef.current.click();
  }
  function onFileSelect(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    for (let i=0; i < files.length; i++) {
      if (files[i].type.split('/')[0] !== 'image') continue;
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
    if(images.length > 1){
      setIsLastImage(false);
    }
  }
    
  function deleteImage(index) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index ));
  }

  function onDragOver(event){
    event.preventDefault(); 
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }
  function onDragLeave (event) {
    event.preventDefault(); 
    setIsDragging (false);
  }
    function onDrop(event) {
    event.preventDefault(); 
    setIsDragging (false);
    const files = event.dataTransfer.files;
    if (files.length === 0) return;
    for (let i=0; i < files.length; i++) {
      if (files[i].type.split('/')[0] !== 'image') continue;
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
  

  return (
    <div style={{display:"flex"}}>
      <div className={cx("sidenav")}>
        <div style={{height: "120px", display: "flex", justifyContent: "center", alignItems:"center"}}>
          <button className={cx("sidenav__button")} >
            <InstagramIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
          </button>
        </div>

        <div className={cx("sidenav__buttons")}>
          <button className={cx("sidenav__button")}>
            <HomeOutlinedIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
          </button>
          <button className={cx("sidenav__button")} onClick={() => setOpen(!open)}>
            <SearchIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px", marginLeft: "3px"}}/>
          </button>
          <button className={cx("sidenav__button")}>
            <ExploreOutlinedIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
          </button>
          <button className={cx("sidenav__button")}>
            <MovieOutlinedIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
          </button>
          <button className={cx("sidenav__button")}>
            <ChatOutlinedIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
          </button>
          <button className={cx("sidenav__button")}>
            <FavoriteBorderIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
          </button>
          <button className={cx("sidenav__button")} onClick={toggleModal}>
            <AddBoxOutlinedIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
          </button>
          <button className={cx("sidenav__button")}>
            <Avatar className={cx("sidenav__icon")} style={{width: "24px",height: "24px", margin: "3px"}}>
              A
            </Avatar>
          </button>
        </div>
        <div className={cx("sidenav__more")}>
          <button className={cx("sidenav__button")}>
            <DensityMediumOutlinedIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px"}}/>
          </button>
        </div>
      </div>
      <div style={{marginLeft:"81px", height: "100%"}}>
        
          <div className={cx("open")} style={open ? { transform: "translateX(0%)" } : null}>
            {/* {notifications.map((n) => displayNotification(n))} */}
            <div className={cx("open__title")}>
              <span >Search</span>
            </div>
            <div className={cx("open__input")}>
              <input type="text"  placeholder="Search"/>
            </div>
            <div className={cx("open__content")} style={{paddingTop: "12px"}}>
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
        <div className={cx("modal active-modal")} onDragOver={isDropping ? null : onDragOver} onDragLeave={isDropping ? null : onDragLeave} onDrop={isDropping ? null : onDrop}>
          <div onClick={toggleModal} className={cx("overlay")} style={{alignSelf: "flex-end"}}>
            <CloseIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px",color: "white", margin: "12px 30px", position: "absolute", right: "0", cursor: "pointer" }}/>
          </div>
          {isDropping ? (
          <div className={cx("modal-content")} style={{height: "auto"}} >
            <div className={cx("modal-header")} style={{display: "flex"}}>
              <div style={{width: "7%", height: "22.4px"}}>
                <WestIcon className={cx("sidenav__icon")} style={{width: "27px",height: "27px", cursor: "pointer" }}/>
              </div>
              <div style={{width: "86%"}}>
                Crop
              </div>
              <span className={cx("header-next")} style={{width: "7%"}}>
                Next
              </span>
            </div>
            <div className={cx("modal-main")}  style={ isDragging ? {backgroundColor: "black"} : null}>
              <div className="container " style={{width: "100%", borderRadius: "0px 0px 10px 10px", display: "flex", backgroundColor: "black"}}> 
                <div className="image" style={{width: "100%", display: "flex", overflow: "hidden"}}>
                  {images.map((images, index) => (
                    <img classname={cx("img-slider")} style={{width: "100%", transform: `translateX(-${100 * imageIndex}%)`, 
                    objectFit: "contain",
                    height: "auto",
                    display: "block",
                    flexShrink: "0",
                    flexGrow: "0",
                    borderRadius: "0px 0px 10px 10px"}} aria-hidden={imageIndex !== index} src={images.url} alt={images.name}  /> 
                  ))}
                  {isFirstImage === true ? (null) :
                  (
                  <button
                    onClick={showPrevImage}
                    className="img-slider-btn"
                    style={{ left: 0 }}
                    aria-label="View Previous Image"
                  >
                    <ArrowBackIosNewIcon aria-hidden />
                  </button>
                  )}
                  {isLastImage === true ? (null) :
                  (
                  <button
                    onClick={showNextImage}
                    className="img-slider-btn"
                    style={{ right: 0 }}
                    aria-label="View Next Image"
                  >
                    <ArrowForwardIosIcon aria-hidden />
                  </button>
                  )}
                </div>
              </div>
            </div>
          </div>) :
              (<div className={cx("modal-content")} >
                <div className={cx("modal-header")}>Create new post</div>
                <div className={cx("modal-main")} style={ isDragging ? {backgroundColor: "black"} : null}>
                  <div>
                    <div className={cx("modal-image")}>
                      <CollectionsOutlinedIcon className={cx("modal-logo")} />
                    </div>
                    {isDragging ? (<div className={cx("modal-text")} >Drop photos and videos here</div>)
                      :(<div className={cx("modal-text")}>Drag photos and videos here</div>)
                    }
                    
                    <div className={cx("modal-input")}>
                      <input type="file" multiple ref={fileInputRef} onChange={onFileSelect} id="myFileInput" style={{display: 'none'}} />
                        <label role="button" onClick={selectFiles} className={cx("modal-upload")}>
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

export default NavBarMini;