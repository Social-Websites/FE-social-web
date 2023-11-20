import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import classNames from "classnames/bind";
import {
  React,
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
import styles from "./Post.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Link, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Skeleton } from "@mui/material";
import TimeAgo from "./TimeAgo";
import { grey, pink } from "@mui/material/colors";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { reactPost } from "../../services/postServices";
import { StateContext } from "../../context/StateContext";
import { updatePostReact } from "../../context/StateAction";

const cx = classNames.bind(styles);

function Post({ post }) {
  const avatarUrl =
    post.creator.profile_picture === ""
      ? "/static-resources/default-avatar.jpg"
      : post.creator.profile_picture;

  const navigate = useNavigate();
  const { user } = useAuth();
  const privateHttpRequest = usePrivateHttpClient();
  const { dispatch } = useContext(StateContext);

  const [text, setText] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [emojiModal, setEmojiModal] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiPickerModalRef = useRef(null);
  const [modal, setModal] = useState(false);
  const [more, setMore] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isFirstImage, setIsFirstImage] = useState(true);
  const [isLastImage, setIsLastImage] = useState(false);

  const [isLike, setIsLike] = useState(post.is_user_like);

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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-modal-open") {
        if (
          emojiPickerModalRef.current &&
          !emojiPickerModalRef.current.contains(event.target)
        ) {
          setEmojiModal(false);
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
  const handleEmojiPickerModal = () => {
    setEmojiModal(!emojiModal);
  };

  const handleEmojiClick = (emoji) => {
    setText((prevText) => (prevText += emoji.emoji));
  };

  const handleSendComment = async () => {};
  const handleReactPost = async () => {
    try {
      setIsLike(!isLike);
      const response = await reactPost(
        { postId: post._id, emoji: "LOVE" },
        privateHttpRequest.privateRequest
      );
    } catch (err) {}
  };

  const toggleModal = () => {
    setModal(!modal);
    if (document.body.style.overflow !== "hidden") {
      window.history.replaceState(null, null, `/p/${post._id}`);
      document.body.style.overflow = "hidden";
    } else {
      window.history.replaceState(null, null, `/`);
      document.body.style.overflow = "auto";
    }
  };

  const toggleMore = () => {
    setMore(!more);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
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

  return (
    <div className={cx("post")}>
      <div className={cx("post__header")}>
        <div className={cx("post__headerAuthor")}>
          {post ? (
            <Link
              to={`/${post.creator?.username}`}
              style={{
                marginRight: 10,
                position: "inherit",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <img
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                src={avatarUrl}
                alt=""
              />
            </Link>
          ) : (
            <Skeleton variant="circular" width={40} height={40} />
          )}
          &nbsp;
          {post ? (
            <Link
              to={`/${post.creator?.username}`}
              style={{
                marginRight: 5,
                position: "inherit",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {post.creator?.username}
            </Link>
          ) : (
            <Skeleton variant="rectangular" />
          )}
          •
          {post ? (
            <span>
              <TimeAgo type="short" created_at={post.created_at} />
            </span>
          ) : (
            <Skeleton variant="rectangular" width={5} />
          )}
        </div>
        <MoreHorizIcon onClick={toggleMore} className={cx("post__more")} />
      </div>
      <div className={cx("post__image")}>
        {post ? (
          <>
            <img
              src={post?.media[0]}
              alt="post-image"
              style={{
                objectFit: "contain",
                height: "auto",
                display: "block",
                flexShrink: "0",
                flexGrow: "0",
              }}
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
          </>
        ) : (
          <Skeleton variant="rounded" />
        )}
      </div>
      <div className={cx("post__footer")}>
        <div className={cx("post__footerIcons")}>
          <div className={cx("post__iconsMain")}>
            <div onClick={handleReactPost} className={cx("postIcon")}>
              {isLike ? (
                <FavoriteIcon sx={{ color: pink[500] }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </div>
            <div className={cx("postIcon")} onClick={toggleModal}>
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
        {post ? (
          <>{post.reacts.length} likes</>
        ) : (
          <Skeleton variant="rectangular" width={10} />
        )}
        {post ? (
          <div style={{ marginTop: 5, fontWeight: 400 }}>{post.content}</div>
        ) : (
          <Skeleton variant="rectangular" />
        )}
      </div>
      <div
        style={{ display: "inline-block", position: "relative", width: "100%" }}
      >
        {emojiPicker && (
          <div style={{ position: "absolute", bottom: 0, right: 0 }}>
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
      <div className={cx("input")} id="emoji-open" ref={emojiPickerRef}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text ? (
          <button
            type="submit"
            style={{
              color: "#0095f6",
              cursor: "pointer",
              background: "none",
              border: "none",
              marginRight: "5px",
              fontSize: "14px",
              fontWeight: "500",
            }}
            onClick={handleSendComment}
          >
            Post
          </button>
        ) : null}
        <SentimentSatisfiedAltIcon
          type="submit"
          style={{
            color: "#A8A8A8",
            cursor: "pointer",
            width: "16px",
            height: "16px",
          }}
          onClick={handleEmojiModal}
        />
      </div>

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
                        to={`/${post.creator?.username}`}
                        className={cx("postInfo-user-avatar")}
                        style={{
                          position: "inherit",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <img
                          style={{ width: "30px", height: "30px" }}
                          src={avatarUrl}
                          alt={post.creator.username + " avatar"}
                        />
                      </Link>
                    </div>
                    <div className={cx("postInfo-user-info")}>
                      <Link
                        to={`/${post.creator?.username}`}
                        style={{
                          position: "inherit",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <span className={cx("postInfo-username")}>
                          {post.creator.username}
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className={cx("post-comment")}>
                    <div className={cx("post-comment-user")}>
                      <div className={cx("post-comment-user-avatar")}>
                        <img
                          style={{ width: "30px", height: "30px" }}
                          src={avatarUrl}
                          alt={post.creator.username + " avatar"}
                        />
                      </div>

                      <div className={cx("post-comment-user-info")}>
                        <span className={cx("post-comment-username")}>
                          {post.creator.username}
                        </span>
                        <span className={cx("post-comment-content")}>
                          {post.content}
                        </span>
                      </div>
                    </div>
                    <div className={cx("post-comment-user")}>
                      <div className={cx("post-comment-user-avatar")}>
                        <img
                          style={{ width: "30px", height: "30px" }}
                          src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"
                          alt=""
                        />
                      </div>
                      <div className={cx("post-comment-user-info")}>
                        <span className={cx("post-comment-username")}>
                          ten ne
                        </span>
                        <span className={cx("post-comment-content")}>
                          neeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
                        </span>
                      </div>
                    </div>
                    <div className={cx("post-comment-user")}>
                      <div className={cx("post-comment-user-avatar")}>
                        <img
                          style={{ width: "30px", height: "30px" }}
                          src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"
                          alt=""
                        />
                      </div>
                      <div className={cx("post-comment-user-info")}>
                        <span className={cx("post-comment-username")}>
                          ten ne
                        </span>
                        <span className={cx("post-comment-content")}>
                          comment neeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={cx("post__footer")}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      borderTop: "#353535 solid 0.5px",
                      height: "20%",
                    }}
                  >
                    <div className={cx("post__footerIcons")}>
                      <div className={cx("post__iconsMain")}>
                        <div className={cx("postIcon")}>
                          {isLike ? (
                            <FavoriteIcon sx={{ color: pink[500] }} />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </div>
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
                    <span>{post.reacts.size} likes</span>
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

                    <div
                      style={{
                        display: "inline-block",
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      {emojiModal && (
                        <div
                          style={{ position: "absolute", bottom: 0, right: 0 }}
                        >
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
                    <div
                      style={{
                        padding: "10px 5px",
                        borderTop: "#353535 solid 0.5px",
                      }}
                      className={cx("input")}
                      id="emoji-modal-open"
                      ref={emojiPickerModalRef}
                    >
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                      {text ? (
                        <button
                          type="submit"
                          style={{
                            color: "#0095f6",
                            cursor: "pointer",
                            background: "none",
                            border: "none",
                            marginRight: "5px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          onClick={handleSendComment}
                        >
                          Post
                        </button>
                      ) : null}
                      <SentimentSatisfiedAltIcon
                        type="submit"
                        style={{
                          color: "#A8A8A8",
                          cursor: "pointer",
                          width: "16px",
                          height: "16px",
                        }}
                        onClick={handleEmojiPickerModal}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
            >
              Report
            </div>
            <div className={cx("more-content-element")}>Add friend</div>
            <div className={cx("more-content-element")}>Go to post</div>
            <div className={cx("more-content-element")}>Cancel</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
