import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames/bind";
import styles from "./Post.scss";
import CommentInput from "../Comment/CommentInput";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Link, useLocation, useNavigate } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TimeAgo from "../../shared/components/TimeAgo";
import { grey, pink } from "@mui/material/colors";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import ReactIcon from "../ReactIcon/ReactIcon";
import { StateContext } from "../../context/StateContext";
import { deleteContextPost } from "../../context/StateAction";
import {
  deletePost,
  getPostComments,
  reportPost,
} from "../../services/postServices";
import {
  Alert,
  Backdrop,
  CircularProgress,
  Snackbar,
  rgbToHex,
} from "@mui/material";
import SavePostIcon from "../SavePostIcon/SavePostIcon";
import Comment from "../Comment/Comment";

const cx = classNames.bind(styles);

const ProfilePost = forwardRef(({ post, creator }, ref) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const privateHttpRequest = usePrivateHttpClient();
  const { dispatch } = useContext(StateContext);

  const [modal, setModal] = useState(false);
  const [more, setMore] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const [imageIndex, setImageIndex] = useState(0);
  const [isFirstImage, setIsFirstImage] = useState(true);
  const [isLastImage, setIsLastImage] = useState(false);

  const [isLiked, setIsLiked] = useState(post.is_user_liked);
  const [reactsCount, setReactsCount] = useState(post.reacts_count);
  const [isSaved, setIsSaved] = useState(post.is_saved);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [page, setPage] = useState(1);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [hadMounted, setHadMounted] = useState(false);

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarNotif, setSnackBarNotif] = useState({
    severity: "success",
    message: "This is success message!",
  }); //severity: success, error, info, warning

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

  const loadComments = useCallback(async () => {
    console.log("comment bị loading nè");
    setCommentsLoading(true);
    try {
      const response = await getPostComments(
        post._id,
        page,
        30,
        privateHttpRequest.privateRequest
      );
      if (response) {
        setHasMoreComments(response.comments > 0 && response.comments === 30);
        setComments((prevComments) => [...prevComments, ...response.comments]);
      }
      setCommentsLoading(false);
    } catch (err) {
      setCommentsLoading(false);
      console.error("Error loading comments: ", err);
    }
  }, [post._id, page]);

  useEffect(() => {
    if (hadMounted && !isFirstMount) loadComments();
  }, [post._id, page]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [inputRef.current]);

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setIsReply(false);
      setInitialText("");
    }
    if (isFirstMount) {
      loadComments();
      setHadMounted(true);
      setIsFirstMount(false);
    }
    if (document.body.style.overflow !== "hidden") {
      window.history.replaceState(null, null, `/p/${post._id}`);
      document.body.style.overflow = "hidden";
    } else {
      window.history.replaceState(null, null, `/${creator.username}/`);
      document.body.style.overflow = "auto";
    }
  };

  const toggleMore = () => {
    setMore(!more);
    if (!more) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      if (!modal) document.body.style.overflow = "auto";
    }
  };

  const goToPost = () => {
    if (more) toggleMore();
    navigate(`/p/${post._id}`, { replace: true });
  };

  const openReport = () => {
    if (more) toggleMore();
    setReportModal(!reportModal);
    if (!reportModal) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      if (!modal) document.body.style.overflow = "auto";
    }
  };

  const handleReportPost = async (reportReason) => {
    try {
      setReportLoading(true);
      const response = await reportPost(
        post._id,
        reportReason,
        privateHttpRequest.privateRequest
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
      console.error(privateHttpRequest.error);
    }
  };

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

  const handleDeletePost = async () => {
    if (!reportLoading) {
      try {
        setReportLoading(true);
        const response = await deletePost(
          post._id,
          privateHttpRequest.privateRequest
        );
        if (response.message) {
          dispatch(deleteContextPost(post._id));
          if (more) toggleMore();
          setReportLoading(false);
          setSnackBarNotif({
            severity: "success",
            message: "Delete post success!",
          });
          setSnackBarOpen(true);
        }
        // Reload the page
        navigate(`/${creator.username}/`);
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
    <>
      <div
        onClick={toggleModal}
        className={cx("profile__post")}
        // style={{ position: "relative" }}
      >
        <img src={post.media[0]} />

        {/* <FavoriteIcon sx={{ color: "white" }} />
        <ChatBubbleIcon /> */}
      </div>
      {ref ? <div ref={ref}></div> : null}
      {modal && (
        <div className={cx("post-modal active-post-modal")}>
          <div
            onClick={toggleModal}
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
          <div className={cx("modal-post-content")}>
            <div className={cx("modal-post-main")}>
              <div className={cx("container-post")}>
                <div className={cx("image-post")} style={{}}>
                  {post?.media.map((image, index) => (
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
                <div
                  className={cx("post-caption")}
                  style={{ position: "relative" }}
                >
                  <div className={cx("postInfo-user")}>
                    <div style={{ padding: 6 }}>
                      <Link
                        to={`/${creator.username}/`}
                        className={cx("postInfo-user-avatar")}
                        style={{
                          position: "inherit",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <img
                          style={{ width: "30px", height: "30px" }}
                          src={getAvatarUrl(creator.profile_picture)}
                          alt={creator.username + " avatar"}
                        />
                      </Link>
                    </div>
                    <div className={cx("postInfo-user-info")}>
                      <Link
                        to={`/${creator.username}/`}
                        style={{
                          position: "inherit",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <span className={cx("postInfo-username")}>
                          {creator.username}
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
                        onClick={toggleMore}
                      />
                    </div>
                  </div>
                  <div className={cx("post-comment")}>
                    <div className={cx("post-comment-user")}>
                      <div
                        className={cx("post-comment-user-avatar")}
                      >
                        <img
                          style={{ width: "30px", height: "30px" }}
                          src={getAvatarUrl(creator.profile_picture)}
                          alt={creator.username + " avatar"}
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
                            {creator.username}
                          </span>
                          <span className={cx("post-comment-content")}>
                            {post.content}
                          </span>
                        </div>
                      </div>
                    </div>
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
                              modal={modal}
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
                            modal={modal}
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
                      height: "25%",
                    }}
                  >
                    <div
                      className={cx("post__footerIcons")}
                      style={{ padding: "0px 10px", height: "33%" }}
                    >
                      <div className={cx("post__iconsMain")}>
                        <ReactIcon
                          userId={[creator._id]}
                          postId={post._id}
                          isLiked={isLiked}
                          setIsLiked={setIsLiked}
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
                          postId={post._id}
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
                        <TimeAgo created_at={post.created_at} />
                      </span>
                    </div>

                    <CommentInput
                      postId={post._id}
                      userId={creator._id}
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
            </div>

            {more && (
              <div className={cx("post-modal active-post-modal")}>
                <div
                  onClick={toggleMore}
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
                  {creator._id !== user._id ? (
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
                    onClick={goToPost}
                    className={cx("more-content-element")}
                  >
                    Go to post
                  </div>
                  <div
                    className={cx("more-content-element")}
                    onClick={toggleMore}
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

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: rgbToHex("rgba(0, 0, 0, 0.1)"),
        }}
        open={reportLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
});

export default ProfilePost;
