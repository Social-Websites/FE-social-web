import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames/bind";
import styles from "./PostDetailPage.module.scss";
import Sidenav from "../../shared/components/NavBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { grey } from "@mui/material/colors";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TimeAgo from "../../shared/components/TimeAgo";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ReactIcon from "../../components/ReactIcon/ReactIcon";
import CommentInput from "../../components/Comment/CommentInput";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import { StateContext } from "../../context/StateContext";
import { getPost, getPostComments, reportPost } from "../../services/postServices";
import { CircularProgress } from "@mui/material";
const cx = classNames.bind(styles);

const PostDetailPage = () => {
  // const navigate = useNavigate();
  const { id } = useParams();
  const { posts } = useContext(StateContext);
  const privateHttpRequest = usePrivateHttpClient();
  const [post, setPost] = useState(null);
  const [more, setMore] = useState(false);
  const [deleteCmt, setDeleteCmt] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  // const [modal, setModal] = useState(false);
  // const [more, setMore] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isFirstImage, setIsFirstImage] = useState(true);
  const [isLastImage, setIsLastImage] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [reactsCount, setReactsCount] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [page, setPage] = useState(1);
  // const [isFirstMount, setIsFirstMount] = useState(true);
  // const [hadMounted, setHadMounted] = useState(false);


  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarNotif, setSnackBarNotif] = useState({
    severity: "success",
    message: "This is success message!",
  }); //severity: success, error, info, warning

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
      const response = await getPost(id, privateHttpRequest.privateRequest);
      if (response) {
        setPost(response.post);
        setIsLiked(response.post.is_user_liked);
        setReactsCount(response.post.reacts_count);
      }
    } catch (err) {
      console.error("Error loading post: ", err);
    }
  }, [id]);

  useEffect(() => {
    // Kiểm tra xem bài viết có tồn tại trong `posts` Map không
    if (posts.has(id)) {
      const foundPost = posts.get(id);
      setPost(foundPost);
      setIsLiked(foundPost.is_user_liked);
      setReactsCount(foundPost.reacts_count);
    } else {
      loadPost();
    }
  }, [id]);

  const loadComments = useCallback(async () => {
    console.log("comment bị loading nè");
    setCommentsLoading(true);
    try {
      const response = await getPostComments(
        id,
        page,
        30,
        privateHttpRequest.privateRequest
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
  }, [id, page]);

  useEffect(() => {
    loadComments();
  }, [id, page]);

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


  const toggleMore = () => {
    setMore(!more);
    if (!more) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const toggleDeleteCmt = () => {
    setDeleteCmt(!deleteCmt);
    if (!deleteCmt) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const openReport = () => {
    if (more) toggleMore();
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

  return (
    <div className={cx("postpage")}>
      <div className={cx("postpage__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("postpage__content")}>
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
                  {isFirstImage === true || post?.media.length === 1 ? null : (
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
                  {isLastImage === true || post?.media.length === 1 ? null : (
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
          <div className={cx("post-caption")} style={{ position: "relative" }}>
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
                    to={`/${post?.creator.username}`}
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
                    to={`/${post?.creator.username}`}
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
                <div className={cx("more")} style={{justifyContent: "end", alignItems:"center", display:"flex", width: "100%", marginRight: "15px", cursor: "pointer"}}>
                  <MoreHorizIcon style={{color: "white"}} onClick={toggleMore}/>
                </div>
              </div>
            )}
            <div className={cx("post-comment")}>
              {post && (
                <div className={cx("post-comment-user")}>
                  <div className={cx("post-comment-user-avatar")}>
                    <img
                      style={{ width: "30px", height: "30px" }}
                      src={getAvatarUrl(post?.creator.profile_picture)}
                      alt={post?.creator.username + " avatar"}
                    />
                  </div>

                  <div className={cx("post-comment-user-info")}>
                    <span className={cx("post-comment-username")}>
                      {post?.creator.username}
                    </span>
                    <span className={cx("post-comment-content")}>
                      {post?.content}
                    </span>
                  </div>
                </div>
              )}
              {comments.length > 0 &&
                comments.map((comment, i) => {
                  if (comments.length === i + 1) {
                    return (
                      <div
                        ref={lastCommentRef}
                        key={comment._id}
                        className={cx("post-comment-user")}
                      >
                        <div className={cx("post-comment-user-avatar")}>
                          <Link
                            to={`/${comment.user.username}`}
                            className={cx("post-comment-user-avatar")}
                            style={{
                              position: "inherit",
                              textDecoration: "none",
                              color: "inherit",
                            }}
                          >
                            <img
                              style={{ width: "30px", height: "30px" }}
                              src={getAvatarUrl(comment.user.profile_picture)}
                              alt=""
                            />
                          </Link>
                        </div>
                        <div>
                          <div className={cx("post-comment-user-info")}>
                            <Link
                              to={`/${comment.user.username}`}
                              style={{
                                position: "inherit",
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              <span className={cx("post-comment-username")}>
                                {comment.user.username}
                              </span>
                            </Link>
                            <span className={cx("post-comment-content")}>
                              {comment.comment}
                            </span>
                          </div>
                          <div style={{display: "flex", alignItems: "center", height: "18px"}}>
                            <span style={{color: "#A8A8A8", fontSize: "12px", marginRight: "12px"}}>1d</span>
                            <MoreHorizIcon className={cx("moreCmt")} style={{color: "white"}} onClick={toggleDeleteCmt}/>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={comment._id} className={cx("post-comment-user")}>
                      <div className={cx("post-comment-user-avatar")}>
                        <Link
                          to={`/${comment.user.username}`}
                          className={cx("post-comment-user-avatar")}
                          style={{
                            position: "inherit",
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <img
                            style={{ width: "30px", height: "30px" }}
                            src={getAvatarUrl(comment.user.profile_picture)}
                            alt=""
                          />
                        </Link>
                      </div>
                      <div>
                        <div className={cx("post-comment-user-info")}>
                          <Link
                            to={`/${comment.user.username}`}
                            style={{
                              position: "inherit",
                              textDecoration: "none",
                              color: "inherit",
                            }}
                          >
                            <span className={cx("post-comment-username")}>
                              {comment.user.username}
                            </span>
                          </Link>
                          <span className={cx("post-comment-content")}>
                            {comment.comment}
                          </span>
                        </div>
                        <div style={{display: "flex", alignItems: "center", height: "18px"}}>
                          <span style={{color: "#A8A8A8", fontSize: "12px", marginRight: "12px"}}>1d</span>
                          <MoreHorizIcon className={cx("moreCmt")} style={{color: "white"}} onClick={toggleDeleteCmt}/>
                        </div>
                      </div>
                    </div>
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
                borderTop: "#353535 solid 0.5px",
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
                    <ChatBubbleOutlineIcon />
                  </div>
                  <div className={cx("postIcon")}>
                    <TelegramIcon />
                  </div>
                </div>
                <div className={cx("post__iconSave")}>
                  <div
                    className={cx("postIcon")}
                    style={{ padding: "7px 0px 7px 7px" }}
                  >
                    <BookmarkBorderIcon />
                  </div>
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
                postId={post?._id}
                userId={post?.creator._id}
                setComments={setComments}
                emojiPickerPos="right"
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
              <div
                className={cx("more-content-element")}
                style={{ color: "#ed4956" }}
                onClick={openReport}
              >
                Report
              </div>
              <div className={cx("more-content-element")} onClick={toggleMore}>
                Cancel
              </div>
            </div>
          </div>
        )}
        {deleteCmt && (
          <div className={cx("post-modal active-post-modal")}>
            <div
              onClick={toggleDeleteCmt}
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
              <div
                className={cx("more-content-element")}
                style={{ color: "#ed4956" }}
                // onClick={handleUnsent}
              >
                Delete
              </div>
              <div className={cx("more-content-element")} onClick={toggleDeleteCmt}>Cancel</div>
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
  );
};

export default PostDetailPage;
