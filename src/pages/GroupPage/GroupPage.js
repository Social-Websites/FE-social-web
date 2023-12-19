import React, { useState } from "react";
import GroupItem from "../../components/GroupItem";
import Button from "@mui/material/Button";
import SearchGroupLoading from "../../components/SearchGroupLoading";
import classNames from 'classnames/bind';
import styles from "./GroupPage.module.scss";
import Sidenav from "../../shared/components/NavBar";
import GroupInvited from "../../components/GroupInvited";
import CloseIcon from "@mui/icons-material/Close";


import getAvatarUrl from "../../shared/util/getAvatarUrl";
import { Link } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
const cx = classNames.bind(styles);

function GroupPage() {
  const [createModal, setCreateModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchedGroups, setSearchedGroups] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const toggleCreate = () => {
    setCreateModal(!createModal);
    if (!createModal) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };
  const [groups, setGroups] = useState([
    {
      name: "redian_ group ne ha ha ha ha ha ha h",
      groupImage: 
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      likes: 54,
      timestamp: "2d",
    },
    {
      name: "redian_ group ne ha ha ha ha ha ha h",
      groupImage: 
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      likes: 54,
      timestamp: "2d",
    },
    {
      name: "redian_ group ne ha ha ha ha ha ha h",
      groupImage: 
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      likes: 54,
      timestamp: "2d",
    },
    {
      name: "johndoe",
      groupImage:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80",
      likes: 432,
      timestamp: "2d",
    },
    {
      name: "mariussss",
      groupImage:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
      likes: 140,
      timestamp: "2d",
    },
    {
      name: "kobee_18",
      groupImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGCAaQ5u1TMTij5ELPWi5-VPtlSqELw-R6lj0EpYmNcGt56kOQaCokzS0IK81MOSphlkw&usqp=CAU",
      likes: 14,
      timestamp: "2d",
    },
  ]);

  // const searchGroups = async (e) => {
  //   const data = e.target.value;
  //   try {
  //     const result = await usersService.searchUsers(data);
  //     // console.log(result);
  //     if (result !== null) {
  //       setSearchedGroups(result);
  //       setIsLoadingSearch(false);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // const debounce = (fn, delay) => {
  //   let timerId = null;

  //   return function (...args) {
  //     setIsLoadingSearch(true);
  //     clearTimeout(timerId);

  //     timerId = setTimeout(() => {
  //       fn.apply(this, args);
  //     }, delay);
  //   };
  // };
  // const debouncedSearchGroups = debounce(searchGroups, 500);

  return (
    <div className={cx("group")} style={{backgroundColor: "black", height: "100%"}}>
      <div className={cx("group__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("group__right")}>
        <div className={cx("group__content")}>
          <div className={cx("group__header")}>
            <div className={cx("group__input")}>
              <input
                type="text"
                // onChange={debouncedSearchGroups}
                placeholder="Search groups...."
              />
            </div>
            <div className={cx("group__button")}>
              <button
                onClick={toggleModal}
                style={{marginRight: "10px"}}
                className={cx("create__button")}
              >
                <span>Invited</span>
              </button>
              <button
                onClick={toggleCreate}
                className={cx("create__button")}
              >
                <span>+ Create</span>
              </button>
            </div>
          </div>
          <div className={cx("groups")}>
            <SearchGroupLoading />
          </div>
          <div className={cx("groups")}>
            <div style={{width: "90%", paddingBottom: "20px", borderBottom: "#212121 solid 1px"}}>
              <div className={cx("group__items_header")}>Your groups</div>
              <div className={cx("group__items")} >
                  {groups.map((group) => (
                      <GroupItem
                        group={group}
                      />
                  ))}
              </div>
            </div>
          </div>
          <div className={cx("groups")}>
            <div style={{width: "90%", paddingBottom: "20px"}}>
              <div className={cx("group__items_header")}>All groups you have joined</div>
              <div className={cx("group__items")} >
                  {groups.map((group) => (
                      <GroupItem
                        group={group}
                      />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {createModal && (
        <div className={cx("group-modal active-group-modal")}>
          <div
            onClick={toggleCreate}
            className={cx("group-overlay")}
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
              <div className={cx("more-content-title")}>
                Create Group
              </div>
            </div>
            <div className={cx("more-content-info")}>
              <div className={cx("group__content__info")}>
                <div className={cx("group__content__info__subject")}>
                  <span >Name</span>
                </div>
                <div className={cx("group__content__info__textarea")}>
                  <input
                    style={{height: "20px", overflow: "none"}}
                    // value={bio}
                    // onChange={(e) => {
                    //   setBio(e.target.value);
                    //   setBioModified(true);
                    // }}
                    placeholder="Name..."
                  ></input>
                </div>
              </div>
              <div className={cx("group__content__info")}>
                <div className={cx("group__content__info__subject")}>
                  <span>Bio</span>
                </div>
                <div className={cx("group__content__info__textarea")}>
                  <textarea
                    // value={bio}
                    // onChange={(e) => {
                    //   setBio(e.target.value);
                    //   setBioModified(true);
                    // }}
                    placeholder="Bio..."
                  ></textarea>
                </div>
              </div>
              <div className={cx("group__content__info")}>
                <div className={cx("group__content__info__subject")}>
                  <span></span>
                </div>
                <div
                  className={cx("group__content__info__button")}
                  style={{
                    position: "relative",
                  }}
                >
                  <Button
                    sx={{
                      fontFamily: "inherit",
                      textTransform: "none",
                      ":hover": {
                        opacity: 0.8,
                      },
                      opacity: 
                      // !bioModified || updateProfileLoading ? 0.5 : 
                      1,
                    }}
                    // onClick={updateBio}
                    // disabled={!bioModified || updateProfileLoading}
                  >
                    Submit
                  </Button>
                  {/* {updateProfileLoading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: "white",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-8px",
                      }}
                    />
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {modal && (
        <div className={cx("group-modal active-group-modal")}>
          <div
            onClick={toggleModal}
            className={cx("group-overlay")}
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
              <div className={cx("more-content-title")}>
                Groups Invited
              </div>
            </div>
            <div className={cx("group-modal-content")}>
            {groups.map((group) => {
              console.log(group);
              return (
                <GroupInvited
                  group={group}
                />
              );
            })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupPage;