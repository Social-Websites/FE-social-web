import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import classNames from "classnames/bind";
import styles from "./PostGroupDetail.module.scss";
import Sidenav from "../../shared/components/NavBar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import WestIcon from "@mui/icons-material/West";
import TimeAgo from "../../shared/components/TimeAgo";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { grey } from "@mui/material/colors";
import CommentInput from "../../components/Comment/CommentInput";
import Button from "@mui/material/Button";
import ReactIcon from "../../components/ReactIcon/ReactIcon";
import EmojiPicker from "emoji-picker-react";
import UserRequestGroup from "../../components/UserRequestGroup";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import { StateContext } from "../../context/StateContext";

import {
  getDownloadURL,
  ref,
  storage,
  uploadBytesResumable,
} from "../../config/firebase";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createGroupPost,
  getGroupDetail,
  getGroupPosts,
  getJoinRequests,
  getMembers,
  getUserFriendsList,
  editGroup,
} from "../../services/groupService";
import {
  deletePost,
  getPost,
  getPostComments,
  reportPost,
} from "../../services/postServices";
import getGroupCoverUrl from "../../shared/util/getGroupCoverUrl";
import SavePostIcon from "../../components/SavePostIcon/SavePostIcon";
import Comment from "../../components/Comment/Comment";
import Error404Page from "../AuthPage/Error404Page";

const cx = classNames.bind(styles);

function PostGroupDetail() {
  const [more, setMore] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalRequestsLoading, setModalRequestsLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);
  const [modalInvite, setModalInvite] = useState(false);
  const [modalMembers, setModalMembers] = useState(false);
  const [userRequests, setUserRequests] = useState([]);

  const privateHttpClient = usePrivateHttpClient();

  const { user, posts, dispatch } = useContext(StateContext);
  const navigate = useNavigate();
  const { id, pId } = useParams();
  useEffect(() => {
    console.log(id, pId);
  }, [id]);
  const location = useLocation();
  const path = location.pathname;
  const subPath = path.substring(path.indexOf("/", 3) + 1);

  const [groupDetail, setGroupDetail] = useState(null);
  const [groupDetailLoading, setGroupDetailLoading] = useState(false);
  const [cover, setCover] = useState("");
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

  const [postsLoading, setPostsLoading] = useState(false);
  const [postsPage, setPostsPage] = useState(1);

  const getGroupDetailData = useCallback(async () => {
    if (!groupDetailLoading) {
      try {
        setGroupDetailLoading(true);
        const data = await getGroupDetail(id, privateHttpClient.privateRequest);

        if (data) {
          setGroupDetail(data.group_detail);
          setName(data.group_detail.name);
          setBio(data.group_detail.description);
          setCover(data.group_detail.cover);
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
        file: selectedFile,
      });
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
    if (coverChange) {
      promise = new Promise((resolve, reject) => {
        const name = Date.now();
        const storageRef = ref(storage, `images/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, coverChange.file);
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
    try {
      let editData = null;
      let urlString = cover;
      if (promise !== null) {
        const url = await Promise.allSettled([promise]);
        urlString = url[0].value.toString();
        editData = {
          name: name,
          description: bio,
          cover: urlString,
          groupId: id,
        };
      } else {
        editData = {
          name: name,
          description: bio,
          cover: cover,
          groupId: id,
        };
      }
      console.log(editData);
      const result = await editGroup(
        editData,
        privateHttpClient.privateRequest
      );
      if (result) {
        setEditingGroup(false);
        setGroupDetail((prev) => ({
          ...prev,
          name: name,
          description: bio,
          cover: urlString,
        }));
        toggleEdit();
        setCoverChange(null);
      }
    } catch (err) {
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
    if (!modalRequest) getJoinRequetsList();
    else setUserRequests([]);

    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };
  const toggleModalInvite = () => {
    setModalInvite(!modalInvite);
    if (!modalInvite) getFriendsList();
    else setUserRequests([]);

    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };
  const toggleModalMembers = () => {
    setModalMembers(!modalMembers);
    if (!modalMembers) getMembersList();
    else setUserRequests([]);

    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const getFriendsList = useCallback(
    async () => {
      try {
        setModalRequestsLoading(true);
        const data = await getUserFriendsList(
          id,
          1,
          20,
          privateHttpClient.privateRequest
        );
        if (data) {
          setUserRequests(data.friends);
          // const recordsCount = data.friend_requests.length;

          // setHasMoreFriendRequests(recordsCount > 0 && recordsCount === 20);
          // if (recordsCount > 0 && friends.length === 0)
          //   setFriendRequests(data.friend_requests);
          // if (recordsCount > 0 && friends.length > 0)
          //   setFriendRequests((prev) => [...prev, ...data.friend_requests]);
          setModalRequestsLoading(false);
        }
      } catch (err) {
        setModalRequestsLoading(false);
        console.error("list ", err);
      }
    },
    [
      // friendRequestsPage
    ]
  );

  const getJoinRequetsList = useCallback(async () => {
    if (!modalRequestsLoading) {
      try {
        setModalRequestsLoading(true);
        const data = await getJoinRequests(
          id,
          1,
          200,
          privateHttpClient.privateRequest
        );
        if (data) {
          setUserRequests(data.users);
          // const recordsCount = data.friend_requests.length;

          // setHasMoreFriendRequests(recordsCount > 0 && recordsCount === 20);
          // if (recordsCount > 0 && friends.length === 0)
          //   setFriendRequests(data.friend_requests);
          // if (recordsCount > 0 && friends.length > 0)
          //   setFriendRequests((prev) => [...prev, ...data.friend_requests]);
          setModalRequestsLoading(false);
        }
      } catch (err) {
        setModalRequestsLoading(false);
        console.error("list ", err);
      }
    }
  }, [id]);

  const getMembersList = useCallback(async () => {
    if (!modalRequestsLoading) {
      try {
        setModalRequestsLoading(true);
        const data = await getMembers(
          id,
          1,
          200,
          privateHttpClient.privateRequest
        );
        if (data) {
          setUserRequests(data.members);
          // const recordsCount = data.friend_requests.length;

          // setHasMoreFriendRequests(recordsCount > 0 && recordsCount === 20);
          // if (recordsCount > 0 && friends.length === 0)
          //   setFriendRequests(data.friend_requests);
          // if (recordsCount > 0 && friends.length > 0)
          //   setFriendRequests((prev) => [...prev, ...data.friend_requests]);
          setModalRequestsLoading(false);
        }
      } catch (err) {
        setModalRequestsLoading(false);
        console.error("list ", err);
      }
    }
  }, [id]);

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

      const postData = { groupId: id, title: titlePost, urlStrings };
      const response = await createGroupPost(
        postData,
        privateHttpClient.privateRequest
      );

      if (response !== null) {
        // createdPostId = response.post._id;
        // dispatch(
        //   addCreatedPost({
        //     ...response.post,
        //     is_user_liked: false,
        //     reacts_count: 0,
        //     comments_count: 0,
        //   })
        // );
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
          message: "Post has waiting for admin approve!",
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

  const [notFound, setNotFound] = useState(false);
  const [post, setPost] = useState(null);
  const [morePost, setMorePost] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [reactsCount, setReactsCount] = useState(0);
  const [isSaved, setIsSaved] = useState(post?.is_saved);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [page, setPage] = useState(1);
  // const [isFirstMount, setIsFirstMount] = useState(true);
  // const [hadMounted, setHadMounted] = useState(false);

  const [initialText, setInitialText] = useState("");
  const [isReply, setIsReply] = useState(false);
  const [replyCommentId, setReplyCommentId] = useState("");
  // Create a ref for the input element
  const inputRef = useRef(null);
  // State to store replyComments for each comment
  const [replyComments, setReplyComments] = useState({});
  // State to track viewReplies for each comment
  const [commentViewReplies, setCommentViewReplies] = useState({});

  const handleChangeViewReplies = (commentId, newValue) => {
    setCommentViewReplies((prev) => ({
      ...prev,
      [commentId]: newValue,
    }));
  };

  // Function to add a replyComment to the state
  const addReplyComments = (commentId, replyComments) => {
    setReplyComments((prevComments) => ({
      ...prevComments,
      [commentId]: [...replyComments],
    }));
  };

  // Function to add a replyComment to the state
  const addReplyComment = (commentId, replyComment) => {
    setReplyComments((prevComments) => ({
      ...prevComments,
      [commentId]: [...(prevComments[commentId] || []), replyComment],
    }));
    setComments((prevComments) => {
      const updatedComments = [...prevComments];
      const commentIndex = updatedComments.findIndex(
        (comment) => comment._id === commentId
      );
      if (commentIndex !== -1) {
        const updatedComment = { ...updatedComments[commentIndex] };
        updatedComment.children_cmts_count =
          (updatedComment.children_cmts_count || 0) + 1;
        updatedComments[commentIndex] = updatedComment;
      }
      return updatedComments;
    });
    setCommentViewReplies((prev) => ({
      ...prev,
      [commentId]: true,
    }));
  };

  const deleteReplyComment = (commentId, replyCommentId) => {
    setReplyComments((prevComments) => {
      const updatedReplies = { ...prevComments };
      if (updatedReplies[commentId]) {
        updatedReplies[commentId] = updatedReplies[commentId].filter(
          (reply) => reply._id !== replyCommentId
        );
      }
      return updatedReplies;
    });

    setComments((prevComments) => {
      const updatedComments = [...prevComments];
      const commentIndex = updatedComments.findIndex(
        (comment) => comment._id === commentId
      );
      if (commentIndex !== -1) {
        const updatedComment = { ...updatedComments[commentIndex] };
        updatedComment.children_cmts_count =
          (updatedComment.children_cmts_count || 0) - 1;
        updatedComments[commentIndex] = updatedComment;
      }
      return updatedComments;
    });
  };

  const observer = useRef();
  const lastCommentRef = useCallback(
    (node) => {
      if (commentsLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreComments) {
          console.log("Last comment");
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [commentsLoading, hasMoreComments]
  );

  const loadPost = useCallback(async () => {
    console.log("post bị loading nè");

    try {
      const response = await getPost(pId, privateHttpClient.privateRequest);
      if (response) {
        setPost(response.post);
        setIsLiked(response.post.is_user_liked);
        setReactsCount(response.post.reacts_count);
        setIsSaved(response.post.is_saved);
        window.scrollTo(0, document.documentElement.scrollHeight);
      }
    } catch (err) {
      console.error("Error loading post: ", err);
      if (err.statusCode === 404) {
        console.log("Post not found!");
        setNotFound(true);
      }
    }
  }, [pId]);

  useEffect(() => {
    if (notFound) setNotFound(false);
    // Kiểm tra xem bài viết có tồn tại trong `posts` Map không
    // if (posts.has(pId)) {
    //   const foundPost = posts.get(pId);
    //   setPost(foundPost);
    //   setIsLiked(foundPost.is_user_liked);
    //   setReactsCount(foundPost.reacts_count);
    //   setIsSaved(foundPost.is_saved);
    // } else {
    loadPost();
    //}
  }, [pId]);

  const loadComments = useCallback(async () => {
    console.log("comment bị loading nè");
    setCommentsLoading(true);
    try {
      const response = await getPostComments(
        pId,
        page,
        30,
        privateHttpClient.privateRequest
      );
      if (response) {
        setHasMoreComments(response.comments > 0 && response.comments === 30);
        if (page === 1) setComments(response.comments);
        else
          setComments((prevComments) => [
            ...prevComments,
            ...response.comments,
          ]);
      }
      setCommentsLoading(false);
    } catch (err) {
      setCommentsLoading(false);
      console.error("Error loading comments: ", err);
    }
  }, [pId, page]);

  useEffect(() => {
    loadComments();
  }, [pId, page]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [inputRef.current]);

  function showNextImage() {
    setImageIndex((index) => {
      if (index === post?.media.length - 2) {
        setIsLastImage(true);
        setIsFirstImage(false);
        return post?.media.length - 1;
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

  const toggleMorePost = () => {
    setMorePost(!morePost);
    if (!morePost) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const openReport = () => {
    if (morePost) toggleMorePost();
    setReportModal(!reportModal);
    if (!reportModal) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const handleReportPost = async (reportReason) => {
    try {
      setReportLoading(true);
      const response = await reportPost(
        post._id,
        reportReason,
        privateHttpClient.privateRequest
      );
      if (response.message) {
        setReportLoading(false);
        if (reportModal) openReport();
        setSnackBarNotif({
          severity: "success",
          message: "Report post success with reason: " + reportReason,
        });
        setSnackBarOpen(true);
      }
    } catch (err) {
      setReportLoading(false);
      setSnackBarNotif({
        severity: "error",
        message: "Report post fail with reason: " + reportReason,
      });
      setSnackBarOpen(true);
      console.error(privateHttpClient.error);
    }
  };

  const handleDeletePost = async () => {
    if (!reportLoading) {
      try {
        setReportLoading(true);
        const response = await deletePost(
          post._id,
          privateHttpClient.privateRequest
        );
        if (response.message) {
          setReportLoading(false);
          if (morePost) toggleMorePost();
          setSnackBarNotif({
            severity: "success",
            message: "Delete post success!",
          });
          setSnackBarOpen(true);
          navigate("/", { replace: true });
        }
      } catch (err) {
        setReportLoading(false);
        setSnackBarNotif({
          severity: "error",
          message: "Delete post fail: " + err,
        });
        setSnackBarOpen(true);
      }
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
                  <a
                    className={cx("follow")}
                    onClick={toggleModalMembers}
                    style={{ cursor: "pointer" }}
                  >
                    {groupDetail?.members_count} members
                  </a>
                  {groupDetail?.is_group_admin && (
                    <a
                      className={cx("follow")}
                      onClick={toggleModalRequest}
                      style={{ cursor: "pointer" }}
                    >
                      {groupDetail?.requests_count} requests
                    </a>
                  )}
                </div>
              </div>
              <div className={cx("group__info__2")}>
                <button className={cx("profile__button")} onClick={toggleModal}>
                  <span>Create Post</span>
                </button>
                {groupDetail?.is_group_admin && (
                  <button
                    className={cx("profile__button")}
                    onClick={toggleModalInvite}
                  >
                    <span>+ Invite</span>
                  </button>
                )}
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
          <div className={cx("postpage__content")} style={{ color: "white" }}>
            {notFound ? (
              <Error404Page notAuthPage={true} />
            ) : (
              <div className={cx("container-post")}>
                {post && (
                  <div className={cx("image-post")} style={{}}>
                    {post.media.map((image, index) => (
                      <div
                        key={index}
                        className={cx("img-post-slider")}
                        style={{
                          width: "100%",
                          height: "100%",
                          transform: `translateX(-${100 * imageIndex}%)`,
                          transition: "transform 0.2s",
                          display: "flex",
                          flexShrink: "0",
                          flexGrow: "0",
                          borderRadius: "10px 0px 0px 10px",
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
                          }}
                          src={image}
                        />
                        {isFirstImage === true ||
                        post?.media.length === 1 ? null : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <button
                              onClick={showPrevImage}
                              className={cx("img-post-slider-btn")}
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
                        {isLastImage === true ||
                        post?.media.length === 1 ? null : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <button
                              onClick={showNextImage}
                              className={cx("img-post-slider-btn")}
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
                )}
                <div
                  className={cx("post-caption")}
                  style={{ position: "relative" }}
                >
                  {post && (
                    <div className={cx("postInfo-user")}>
                      <div
                        style={{
                          alignItems: "center",
                          display: "flex",
                          marginLeft: "10px",
                        }}
                      >
                        <Link
                          to={`/${post?.creator.username}/`}
                          className={cx("postInfo-user-avatar")}
                          style={{
                            position: "inherit",
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <img
                            style={{ width: "30px", height: "30px" }}
                            src={getAvatarUrl(post?.creator.profile_picture)}
                            alt={post?.creator.username + " avatar"}
                          />
                        </Link>
                      </div>
                      <div className={cx("postInfo-user-info")}>
                        <Link
                          to={`/${post?.creator.username}/`}
                          style={{
                            position: "inherit",
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <span className={cx("postInfo-username")}>
                            {post?.creator.username}
                          </span>
                        </Link>
                      </div>
                      <div
                        className={cx("more")}
                        style={{
                          justifyContent: "end",
                          alignItems: "center",
                          display: "flex",
                          width: "100%",
                          marginRight: "15px",
                          cursor: "pointer",
                        }}
                      >
                        <MoreHorizIcon
                          style={{ color: "white" }}
                          onClick={toggleMorePost}
                        />
                      </div>
                    </div>
                  )}
                  <div className={cx("post-comment")}>
                    {post && (
                      <div className={cx("post-comment-user")}>
                        <div
                          className={cx("post-comment-user-avatar")}
                        >
                          <img
                            style={{ width: "30px", height: "30px" }}
                            src={getAvatarUrl(post?.creator.profile_picture)}
                            alt={post?.creator.username + " avatar"}
                          />
                        </div>
                        <div
                          style={{display: "flex", alignItems: "center"}}
                        >
                          <div
                            className={cx("post-comment-user-info")}
                          >
                            <span
                              className={cx("post-comment-username")}
                              style={{ marginBottom: 0 }}
                            >
                              {post?.creator.username}
                            </span>
                            <span className={cx("post-comment-content")}>
                              {post?.content}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {comments.length > 0 &&
                      comments.map((comment, i) => {
                        if (comments.length === i + 1)
                          return (
                            <Comment
                              cx={cx}
                              key={comment._id}
                              ref={lastCommentRef}
                              comment={comment}
                              more={more}
                              toggleMore={toggleMore}
                              reportLoading={reportLoading}
                              setReportLoading={setReportLoading}
                              modal={false}
                              post={post}
                              setSnackBarNotif={setSnackBarNotif}
                              setSnackBarOpen={setSnackBarOpen}
                              setComments={setComments}
                              setReplyCommentId={setReplyCommentId}
                              setIsReply={setIsReply}
                              inputRef={inputRef}
                              setInitialText={setInitialText}
                              replyComments={replyComments[comment._id] || []}
                              children_cmts_count={comment.children_cmts_count}
                              addReplyComments={addReplyComments}
                              deleteReplyComment={deleteReplyComment}
                              viewReplies={commentViewReplies[comment._id]}
                              setViewReplies={(value) =>
                                handleChangeViewReplies(comment._id, value)
                              }
                            />
                          );
                        return (
                          <Comment
                            cx={cx}
                            key={comment._id}
                            comment={comment}
                            more={more}
                            toggleMore={toggleMore}
                            reportLoading={reportLoading}
                            setReportLoading={setReportLoading}
                            modal={false}
                            post={post}
                            setSnackBarNotif={setSnackBarNotif}
                            setSnackBarOpen={setSnackBarOpen}
                            setComments={setComments}
                            setReplyCommentId={setReplyCommentId}
                            setIsReply={setIsReply}
                            inputRef={inputRef}
                            setInitialText={setInitialText}
                            replyComments={replyComments[comment._id] || []}
                            children_cmts_count={comment.children_cmts_count}
                            addReplyComments={addReplyComments}
                            deleteReplyComment={deleteReplyComment}
                            viewReplies={commentViewReplies[comment._id]}
                            setViewReplies={(value) =>
                              handleChangeViewReplies(comment._id, value)
                            }
                          />
                        );
                      })}
                    {commentsLoading && <CircularProgress size={40} />}
                  </div>
                  <div
                    className={cx("post__footer")}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      height: "30%",
                    }}
                  >
                    <div
                      className={cx("post__footerIcons")}
                      style={{ padding: "0px 10px", height: "33%" }}
                    >
                      <div className={cx("post__iconsMain")}>
                        <ReactIcon
                          userId={[post?.creator._id]}
                          postId={post?._id}
                          isLiked={isLiked}
                          setIsLiked={setIsLiked}
                          reactsCount={reactsCount}
                          setReactsCount={setReactsCount}
                          className={cx("postIcon")}
                        />
                        <div className={cx("postIcon")}>
                          <ChatBubbleOutlineIcon
                            onClick={() => {
                              inputRef.current.focus();
                            }}
                          />
                        </div>
                        <div className={cx("postIcon")}>
                          <TelegramIcon />
                        </div>
                      </div>
                      <div className={cx("post__iconSave")}>
                        <SavePostIcon
                          style={{ padding: "7px 0px 7px 7px" }}
                          className={cx("postIcon")}
                          postId={post?._id}
                          isSaved={isSaved}
                          setIsSaved={setIsSaved}
                          setSnackBarNotif={setSnackBarNotif}
                          setSnackBarOpen={setSnackBarOpen}
                        />
                      </div>
                    </div>
                    <div style={{ padding: "0px 10px", height: "20%" }}>
                      <span>{reactsCount} likes</span>
                      <br />
                      <span
                        style={{
                          color: grey[600],
                          fontSize: 10,
                          textTransform: "uppercase",
                        }}
                      >
                        <TimeAgo created_at={post?.created_at} />
                      </span>
                    </div>

                    <CommentInput
                      ref={inputRef}
                      initialText={initialText}
                      setInitialText={setInitialText}
                      setComments={setComments}
                      emojiPickerPos="left"
                      isReply={isReply}
                      setIsReply={setIsReply}
                      addReplyComment={addReplyComment}
                      parentCommentId={replyCommentId}
                      setReplyCommentId={setReplyCommentId}
                      postId={post?._id}
                      userId={post?.creator._id}
                      style={{
                        padding: "0px 10px",
                        height: "31%",
                        borderTop: "#353535 solid 0.5px",
                      }}
                      className={cx("input")}
                    />
                  </div>
                </div>
              </div>
            )}
            {morePost && (
              <div className={cx("post-modal active-post-modal")}>
                <div
                  onClick={toggleMorePost}
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
                  {post.creator._id !== user._id ? (
                    <div
                      className={cx("more-content-element")}
                      style={{ color: "#ed4956" }}
                      onClick={openReport}
                    >
                      Report
                    </div>
                  ) : (
                    <div
                      className={cx("more-content-element")}
                      style={{ color: "#ed4956" }}
                      onClick={handleDeletePost}
                    >
                      Delete
                    </div>
                  )}
                  <div
                    className={cx("more-content-element")}
                    onClick={toggleMorePost}
                  >
                    Cancel
                  </div>
                </div>
              </div>
            )}

            {reportModal && (
              <div className={cx("post-modal active-post-modal")}>
                <div
                  onClick={openReport}
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
                    <div className={cx("more-content-title")}>
                      Why are you reporting this post?
                    </div>
                  </div>
                  <div
                    className={cx("more-content-report")}
                    onClick={() => handleReportPost("Indecent photo")}
                  >
                    Indecent photo
                  </div>
                  <div
                    className={cx("more-content-report")}
                    onClick={() => handleReportPost("Violence")}
                  >
                    Violence
                  </div>
                  <div
                    className={cx("more-content-report")}
                    onClick={() => handleReportPost("Harassment")}
                  >
                    Harassment
                  </div>
                  <div
                    className={cx("more-content-report")}
                    onClick={() => handleReportPost("Terrorism")}
                  >
                    Terrorism
                  </div>
                  <div
                    className={cx("more-content-report")}
                    onClick={() =>
                      handleReportPost("Hateful language, false information")
                    }
                  >
                    Hateful language, false information
                  </div>
                  <div
                    className={cx("more-content-report")}
                    onClick={() => handleReportPost("Spam")}
                  >
                    Spam
                  </div>
                  <div
                    className={cx("more-content-report")}
                    style={{ color: "#ed4956" }}
                    onClick={openReport}
                  >
                    Cancel
                  </div>
                </div>
              </div>
            )}
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
            {user._id !== groupDetail?.created_by._id ? (
              <div
                className={cx("more-content-element")}
                style={{ color: "#ed4956" }}
              >
                Leave
              </div>
            ) : null}
            {groupDetail?.is_group_admin && (
              <div className={cx("more-content-element")} onClick={toggleEdit}>
                Edit
              </div>
            )}
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
              <div className={cx("more-content-title")}>Join requests</div>
            </div>
            <div className={cx("group-modal-content")}>
              {userRequests.map((user) => {
                return (
                  <UserRequestGroup
                    user={user}
                    setUser={setUserRequests}
                    setGroupDetail={setGroupDetail}
                    type={1}
                  />
                );
              })}
              {modalRequestsLoading && <CircularProgress />}
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
                return (
                  <UserRequestGroup
                    user={user}
                    setUser={setUserRequests}
                    setGroupDetail={setGroupDetail}
                    isGroupAdmin={groupDetail?.is_group_admin}
                    type={2}
                  />
                );
              })}
              {modalRequestsLoading && <CircularProgress />}
            </div>
          </div>
        </div>
      )}
      {modalMembers && (
        <div className={cx("modal active-modal")}>
          <div
            onClick={toggleModalMembers}
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
              <div className={cx("more-content-title")}>Members</div>
            </div>
            <div className={cx("group-modal-content")}>
              {userRequests.map((user) => {
                return (
                  <UserRequestGroup
                    user={user}
                    setUser={setUserRequests}
                    setGroupDetail={setGroupDetail}
                    isGroupAdmin={groupDetail?.is_group_admin}
                    groupOwner={groupDetail?.created_by}
                    type={3}
                  />
                );
              })}
              {modalRequestsLoading && <CircularProgress />}
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
                    src={getAvatarUrl(cover)}
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
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          setSnackBarOpen(false);
        }}
      >
        <Alert
          onClose={(event, reason) => {
            setSnackBarOpen(false);
          }}
          severity={snackBarNotif.severity}
          sx={{ width: "100%" }}
        >
          {snackBarNotif.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PostGroupDetail;
