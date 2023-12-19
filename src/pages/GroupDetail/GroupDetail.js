import React, { useState, useCallback, useEffect } from "react";
import PostRequest from "../../components/PostRequest";
import classNames from 'classnames/bind';
import styles from "./GroupDetail.module.scss";
import Sidenav from "../../shared/components/NavBar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import UserRequestGroup from "../../components/UserRequestGroup";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import {
  getFriendRequestsList,
  getUserByUsername,
  getUserFriendsListByUsername,
  removeAddFriend,
  reportUser,
  sendAddFriend,
  unFriend,
} from "../../services/userService";
const cx = classNames.bind(styles);

function GroupDetail() {
  const [more, setMore] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);
  const [modalInvite, setModalInvite] = useState(false);
  const [userRequests, setUserRequests] = useState([]);
  const privateHttpRequest = usePrivateHttpClient();
  const toggleMore = () => {
    setMore(!more);
    if (!more) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      // if (!modal) document.body.style.overflow = "auto";
    }
  };

  const toggleModalRequest = () => {
    setModalRequest(!modalRequest);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };
  const toggleModalInvite = () => {
    setModalInvite(!modalInvite);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const getFriendRequests = useCallback(async () => {
    console.log("friends request load");
    try {
      // setModalLoading(true);
      const data = await getFriendRequestsList(
        // friendRequestsPage
        1,
        20,
        privateHttpRequest.privateRequest
      );
      setUserRequests(data.friend_requests);
      // if (data) {
      //   const recordsCount = data.friend_requests.length;

      //   setHasMoreFriendRequests(recordsCount > 0 && recordsCount === 20);
      //   if (recordsCount > 0 && friends.length === 0)
      //     setFriendRequests(data.friend_requests);
      //   if (recordsCount > 0 && friends.length > 0)
      //     setFriendRequests((prev) => [...prev, ...data.friend_requests]);
      // }
      // setModalLoading(false);
    } catch (err) {
      // setModalLoading(false);
      console.error("list ", err);
    }
  }, [
    // friendRequestsPage
  ]);
  useEffect(() => {
    // if (listType === 2 && modal) 
    getFriendRequests();
  }, [
    // listType, friendRequestsPage, modal
  ]);

  const [posts, setPosts] = useState([
    {
      creator: {
        username: "redian_",
        profile_picture: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
      },
      media:[
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"],
      likes: 54,
      timestamp: "2d",
    },
    {
      creator: {
        username: "johndoe",
        profile_picture: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
      },
      media:[
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"],
      likes: 432,
      timestamp: "2d",
    },
    {
      creator: {
        username: "mariussss",
        profile_picture: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
      },
      media:[
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"],
      likes: 140,
      timestamp: "2d",
    },
    {
      
      creator: {
        username: "kobee_18",
        profile_picture: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
      },
      media:[
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGCAaQ5u1TMTij5ELPWi5-VPtlSqELw-R6lj0EpYmNcGt56kOQaCokzS0IK81MOSphlkw&usqp=CAU"],
      likes: 14,
      timestamp: "2d",
    },
  ]);
  return (
    <div className={cx("group")} style={{backgroundColor: "black", height: "100%"}}>
      <div className={cx("group__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("group__right")}>
        <div className={cx("group__content")}>
          <div className={cx("group__header")}>
            <div className={cx("group_avatar")}>
                <img src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"/>
            </div>
            <div className={cx("group__info")}>
                <div className={cx("group__info__1")}>
                    <div className={cx("group__name")}> 
                        <span>Group lololo</span>
                    </div>
                    <div className={cx("group__follow")}>  
                        <span>0 posts</span>
                        <a className={cx("follow")}>38 follower</a>
                        <a className={cx("follow")} onClick={toggleModalRequest} style={{cursor: "pointer"}}>30 requests</a>
                    </div>
                </div>
                <div className={cx("group__info__2")}>
                    <button className={cx("profile__button")} onClick={toggleModalInvite}>
                        <span>+ Invite</span>
                    </button>
                    <MoreHorizIcon onClick={toggleMore} className={cx("post__more")} />
                </div>
            </div>
            <div className={cx("group__bio")}>
              <span>hihihihihihi</span>
            </div>
        </div>

        <div className={cx("group__posts")}>
          <div className={cx("group__post")}>
            {posts.map((post) => (
              <PostRequest
                post={post}
                key={post.id} // Add a unique key prop when rendering a list of components
              />
            ))}
          </div>
        </div>
        </div>
      </div>
      {more && (
        <div className={cx("group-modal active-group-modal")}>
          <div
            onClick={toggleMore}
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
            {/* {post.creator._id !== user._id ? (
              <div
                className={cx("more-content-element")}
                style={{ color: "#ed4956" }}
                onClick={openReport}
              >
                Report
              </div>
            ) : ( */}
              <div
                className={cx("more-content-element")}
                style={{ color: "#ed4956" }}
              >
                Leave
              </div>
            {/* )} */}
            <div className={cx("more-content-element")} onClick={toggleMore}>
              Cancel
            </div>
          </div>
        </div>
      )}
      {modalRequest && (
        <div className={cx("group-modal active-group-modal")}>
          <div
            onClick={toggleModalRequest}
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
            {userRequests.map((user) => {
              console.log(user);
              return (
                <UserRequestGroup
                  user={user}
                  type={1}
                />
              );
            })}
            </div>
          </div>
        </div>
      )}
      {modalInvite && (
        <div className={cx("group-modal active-group-modal")}>
          <div
            onClick={toggleModalInvite}
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
            {userRequests.map((user) => {
              console.log(user);
              return (
                <UserRequestGroup
                  user={user}
                  type={2}
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

export default GroupDetail;