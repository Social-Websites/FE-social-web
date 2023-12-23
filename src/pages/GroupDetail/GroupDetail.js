import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import PostRequest from "../../components/PostRequest";
import classNames from "classnames/bind";
import styles from "./GroupDetail.module.scss";
import Sidenav from "../../shared/components/NavBar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import WestIcon from "@mui/icons-material/West";
import GridOnIcon from "@mui/icons-material/GridOn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import { Alert, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import Button from "@mui/material/Button";
import EmojiPicker from "emoji-picker-react";
import UserRequestGroup from "../../components/UserRequestGroup";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import { StateContext } from "../../context/StateContext";
import { createPost } from "../../services/postServices";
import { addCreatedPost } from "../../context/StateAction";
import {
  getFriendRequestsList,
  getUserByUsername,
  getUserFriendsListByUsername,
  removeAddFriend,
  reportUser,
  sendAddFriend,
  unFriend,
} from "../../services/userService";

import {
  getDownloadURL,
  ref,
  storage,
  uploadBytesResumable,
} from "../../config/firebase";
import { useParams } from "react-router-dom";
import { getGroupDetail, editGroup } from "../../services/groupService";
import getGroupCoverUrl from "../../shared/util/getGroupCoverUrl";

const cx = classNames.bind(styles);

function GroupDetail() {
  const [more, setMore] = useState(false);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);
  const [modalInvite, setModalInvite] = useState(false);
  const [userRequests, setUserRequests] = useState([]);
  const privateHttpRequest = usePrivateHttpClient();
  const privateHttpClient = usePrivateHttpClient();

  const { user, dispatch } = useContext(StateContext);
  const { id } = useParams();

  const [groupDetail, setGroupDetail] = useState(null);
  const [groupDetailLoading, setGroupDetailLoading] = useState(false);
  const [cover, setCover] = useState("")
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [coverChange, setCoverChange] = useState(null);
  const [editingGroup, setEditingGroup] = useState(false);
  const [uploadProfileImgLoading, setUploadProfileImgLoading] = useState(false);

  const [creatingPost, setCreatingPost] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(document.title);
  const avatarUrl = getAvatarUrl(user?.profile_picture);

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarNotif, setSnackBarNotif] = useState({
    severity: "success",
    message: "This is success message!",
  }); //severity: success, error, info, warning

  const toggleEdit = () => {
    setEditModal(!editModal);
    if (!editModal) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

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
  const fileEditRef = useRef(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [isFirstImage, setIsFirstImage] = useState(true);
  const [isLastImage, setIsLastImage] = useState(false);
  const checkCurrentChatIdRef = useRef(null);

  const getGroupDetailData = useCallback(async () => {
    if (!groupDetailLoading) {
      try {
        setGroupDetailLoading(true);
        const data = await getGroupDetail(id, privateHttpClient.privateRequest);

        if (data) {
          setGroupDetail(data.group_detail);
          setName(data.group_detail.name)
          setBio(data.group_detail.description)
          setCover(data.group_detail.cover)
          setGroupDetailLoading(false);
        }
      } catch (err) {
        console.error("list ", err);
        setGroupDetailLoading(false);
      }
    }
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Lấy tệp đã chọn
    if (selectedFile) {
      setCoverChange({
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        file: selectedFile
      })
      // Đọc tệp và cập nhật state avatar với URL hình ảnh mới
      const reader = new FileReader();
      reader.onload = (event) => {
          setCover(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const submitEditHandler = async () => {
    setEditingGroup(true);
    let promise = null;
    if(coverChange)(
      promise = () => {
        const name = Date.now();
        const storageRef = ref(storage, `images/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, cover.file);

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
      }
    )
    try {
      let editData = null;
      if(promise !== null){
        const url = await Promise.allSettled(promise);
        const urlString = url.value.toString();
        editData = {
          name: name,
          description: bio,
          cover: urlString, 
          groupId: groupDetail._id,
        };
      } else{
        editData = {
          name: name,
          description: bio,
          cover: cover
        };
      }
      const result = await editGroup(editData, privateHttpClient.privateRequest);
      if (result) {
        setEditingGroup(false);
        toggleEdit();
        setCoverChange(null);
      }
    } catch(err){
      toggleEdit();
      setCoverChange(null);
      console.log(err);
    }
  };

  useEffect(() => {
    getGroupDetailData();
  }, [id]);

  const toggleMore = () => {
    setMore(!more);
    if (!more) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
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


  const getFriendRequests = useCallback(
    async () => {
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
    },
    [
      // friendRequestsPage
    ]
  );
  useEffect(
    () => {
      // if (listType === 2 && modal)
      getFriendRequests();
    },
    [
      // listType, friendRequestsPage, modal
    ]
  );

  const [posts, setPosts] = useState([
    {
      creator: {
        username: "redian_",
        profile_picture:
          "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      },
      media: [
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      ],
      likes: 54,
      timestamp: "2d",
    },
    {
      creator: {
        username: "johndoe",
        profile_picture:
          "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      },
      media: [
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80",
      ],
      likes: 432,
      timestamp: "2d",
    },
    {
      creator: {
        username: "mariussss",
        profile_picture:
          "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      },
      media: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
      ],
      likes: 140,
      timestamp: "2d",
    },
    {
      creator: {
        username: "kobee_18",
        profile_picture:
          "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      },
      media: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGCAaQ5u1TMTij5ELPWi5-VPtlSqELw-R6lj0EpYmNcGt56kOQaCokzS0IK81MOSphlkw&usqp=CAU",
      ],
      likes: 14,
      timestamp: "2d",
    },
  ]);

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
  function selectEditFiles() {
    fileEditRef.current.click();
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
        dispatch(
          addCreatedPost({
            ...response.post,
            is_user_liked: false,
            reacts_count: 0,
            comments_count: 0,
          })
        );
        // socket.current.emit("sendNotification", {
        //   sender_id: user?._id,
        //   receiver_id: user?.friends,
        //   content_id: createdPostId,
        //   type: "post",
        // });
        toggleModal();
        setTitlePost("");
        setCreatingPost(false);
        // onScrollToTop();
        setSnackBarNotif({
          severity: "success",
          message: "Create success",
        });
        setSnackBarOpen(true);
      }
    } catch (err) {
      setCreatingPost(false);
      setSnackBarNotif({
        severity: "error",
        message: "Create fail with message: " + err,
      });
      setSnackBarOpen(true);
      console.log(err);
    } finally {
    }
  };

  return (
    <div
      className={cx("group")}
      style={{ backgroundColor: "black", height: "100%" }}
    >
      <div className={cx("group__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("group__right")}>
        <div className={cx("group__content")}>
          <div className={cx("group__header")}>
            <div className={cx("group_avatar")}>
              <img src={getGroupCoverUrl(groupDetail?.cover)} />
            </div>
            <div className={cx("group__info")}>
              <div className={cx("group__info__1")}>
                <div className={cx("group__name")}>
                  <span>{groupDetail?.name}</span>
                </div>
                <div className={cx("group__follow")}>
                  <span>{groupDetail?.group_posts_count} posts</span>
                  <a className={cx("follow")}>
                    {groupDetail?.members_count} members
                  </a>
                  <a
                    className={cx("follow")}
                    onClick={toggleModalRequest}
                    style={{ cursor: "pointer" }}
                  >
                    {groupDetail?.requests_count} requests
                  </a>
                </div>
              </div>
              <div className={cx("group__info__2")}>
                <button className={cx("profile__button")} onClick={toggleModal}>
                  <span>Create Post</span>
                </button>
                <button
                  className={cx("profile__button")}
                  onClick={toggleModalInvite}
                >
                  <span>+ Invite</span>
                </button>
                <MoreHorizIcon
                  onClick={toggleMore}
                  className={cx("post__more")}
                />
              </div>
            </div>
            <div className={cx("group__bio")}>
              <span>{groupDetail?.description}</span>
            </div>
          </div>
          <div className={cx("group__tag")}>
            <a>
              <div
                className={cx("choose")}
                // onClick={() => {
                //   setUserPosts([]);
                //   setPostPage(1);
                //   setPostType(1);
                // }}
              >
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
              <div
                className={cx("choose")}
                // onClick={() => {
                //   setUserPosts([]);
                //   setPostPage(1);
                //   setPostType(2);
                // }}
              >
                <BookmarkBorderIcon className={cx("icon")} />
                <span
                  className={cx("span")}
                  style={{ textTransform: "uppercase" }}
                >
                  Saved
                </span>
              </div>
            </a>
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
        <div className={cx("modal active-modal")}>
          <div
            onClick={toggleMore}
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
            <div className={cx("more-content-element")} onClick={toggleEdit}>
              Edit
            </div>
            {/* )} */}
            <div className={cx("more-content-element")} onClick={toggleMore}>
              Cancel
            </div>
          </div>
        </div>
      )}
      {modalRequest && (
        <div className={cx("modal active-modal")}>
          <div
            onClick={toggleModalRequest}
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
          <div className={cx("more-content")}>
            <div className={cx("more-content-header")}>
              <div className={cx("more-content-title")}>Groups Invited</div>
            </div>
            <div className={cx("group-modal-content")}>
              {userRequests.map((user) => {
                console.log(user);
                return <UserRequestGroup user={user} type={1} />;
              })}
            </div>
          </div>
        </div>
      )}
      {modalInvite && (
        <div className={cx("modal active-modal")}>
          <div
            onClick={toggleModalInvite}
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
          <div className={cx("more-content")}>
            <div className={cx("more-content-header")}>
              <div className={cx("more-content-title")}>Groups Invited</div>
            </div>
            <div className={cx("group-modal-content")}>
              {userRequests.map((user) => {
                console.log(user);
                return <UserRequestGroup user={user} type={2} />;
              })}
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <div className={cx("modal active-modal")}>
          <div
            onClick={toggleEdit}
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
          <div className={cx("more-content")}>
            <div className={cx("more-content-header")}>
              <div className={cx("more-content-title")}>Edit Group</div>
            </div>
            <div className={cx("more-content-info")}>
              <div className={cx("group__content__info")}>
                <div
                  className={cx("group__content__info__subject")}
                  style={{ position: "relative" }}
                >
                  <img
                    style={{
                      width: "44px",
                      height: "44px",
                      filter: uploadProfileImgLoading
                        ? "brightness(70%)"
                        : "brightness(100%)",
                    }}
                    src={getAvatarUrl(
                      "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
                    )}
                    alt=""
                  />
                  {uploadProfileImgLoading && (
                    <CircularProgress
                      size={30}
                      sx={{
                        color: "blueviolet",
                        position: "absolute",
                        marginTop: "6.6px",
                        marginRight: "6.7px",
                      }}
                    />
                  )}
                </div>

              <div className={cx("group__content__info__user")}>
                <span className={cx("group__username")}>
                  {user?.username}
                </span>
                <input
                  type="file"
                  accept="image/jpg,image/jpeg,image/png,image/webp"
                  multiple
                  ref={fileEditRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <span
                  onClick={selectEditFiles}
                  className={cx("group__changeAvatar")}
                >
                  Change profile photo
                </span>
              </div>
            </div>
              <div className={cx("group__content__info")}>
                <div className={cx("group__content__info__subject")}>
                  <span>Name</span>
                </div>
                <div className={cx("group__content__info__textarea")}>
                  <input
                    style={{ height: "20px", overflow: "none" }}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
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
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                    }}
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
                  {editingGroup ? (
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
                  ) : (
                    <Button
                      sx={{
                        fontFamily: "inherit",
                        textTransform: "none",
                        ":hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={submitEditHandler}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
            <div
              className={cx("modal-navbar-content")}
              style={{ height: "auto", backgroundColor: "#262626" }}
            >
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
                      minHeight: "400px",
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
            <div
              className={cx("modal-navbar-content")}
              style={{ width: "50%", backgroundColor: "#262626" }}
            >
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

export default GroupDetail;
