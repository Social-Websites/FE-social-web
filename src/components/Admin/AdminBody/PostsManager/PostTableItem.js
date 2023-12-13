import { format, parseISO } from "date-fns";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Alert,
  Avatar,
  // Box,
  // Card,
  // Checkbox,
  CircularProgress,
  Menu,
  MenuItem,
  Stack,
  // Table,
  // TableBody,
  TableCell,
  // TableHead,
  // TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { getInitials } from "../../../../shared/util/get-initials";
import { useCallback, useEffect, useContext, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import classNames from "classnames/bind";
import styles from "./PostManager.module.scss";
import usePrivateHttpClient from "../../../../shared/hook/http-hook/private-http-hook";
import { getPostComments } from "../../../../services/postServices";
import {
  getPostReportsCount,
  lockPost,
  unlockPost,
} from "../../../../services/adminServices";
import { StateContext } from "../../../../context/StateContext";

const cx = classNames.bind(styles);

const PostTableItem = ({ post }) => {
  const [visible, setVisible] = useState(false);
  const [viewReports, setViewReports] = useState(false);
  const privateHttpRequest = usePrivateHttpClient();

  const [images, setImages] = useState(post.media);
  const [imageIndex, setImageIndex] = useState(0);
  const [isFirstImage, setIsFirstImage] = useState(true);
  const [isLastImage, setIsLastImage] = useState(false);

  const [reportsCount, setReportsCount] = useState([]);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [page, setPage] = useState(1);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [hadMounted, setHadMounted] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { user, socket } = useContext(StateContext);

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

  const [isLock, setIsLock] = useState(
    post?.deleted_by === "ADMIN" ? true : false
  );

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

  //const isSelected = selected.includes(post._id);
  const createdAt = format(parseISO(post.created_at), "dd/MM/yyyy");

  const handleDeletePost = async () => {
    try {
      if (!isLock) {
        const response = await lockPost(
          post._id,
          privateHttpRequest.privateRequest
        );

        if (response) setIsLock(!isLock);
      } else {
        const response = await unlockPost(
          post._id,
          privateHttpRequest.privateRequest
        );

        if (response) setIsLock(!isLock);
      }
    } catch (err) {
    } finally {
      socket.current.emit("sendNotification", {
        sender_id: user?._id,
        receiver_id: [post.creator._id],
        content_id: post._id,
        type: "hide",
      });
    }
  };

  const loadReportsCount = async () => {
    try {
      const response = await getPostReportsCount(
        post._id,
        privateHttpRequest.privateRequest
      );
      if (response) {
        setReportsCount(response.reports_group_count);
        if (anchorEl) handleClose();
        setViewReports(true);
      }
    } catch (err) {
      console.error("Error loading reports: ", err);
    }
  };

  return (
    <>
      <TableRow
        hover
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(customer.id);
                          } else {
                            onDeselectOne?.(customer.id);
                          }
                        }}
                      />
                    </TableCell> */}
        <TableCell>
          <Stack alignItems="center" direction="row" spacing={2}>
            <Avatar src={post.creator.profile_picture}>
              {getInitials(post.creator.username)}
            </Avatar>
            <Typography variant="subtitle2">{post.creator.username}</Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Typography
            variant="body1"
            component="h6"
            sx={{
              opacity: post.content.length === 0 ? 0.6 : 1,
            }}
          >
            {post.content.length > 25
              ? post.content.substring(0, 25) + "..."
              : post.content || "No title"}
          </Typography>
        </TableCell>
        <TableCell>{post.reacts_count}</TableCell>
        <TableCell>{post.comments_count}</TableCell>
        <TableCell>{createdAt}</TableCell>
        <TableCell style={{ color: isLock ? "red" : "blue" }}>
          {isLock ? "Locked" : "Visibled"}
        </TableCell>
        <TableCell
          style={{
            color:
              post.reports_count < 5
                ? "inherit"
                : post.reports_count >= 5 && post.reports_count < 10
                ? "yellow"
                : post.reports_count >= 10 && post.reports_count < 15
                ? "orange"
                : "red",
          }}
        >
          {post.reports_count}
        </TableCell>
      </TableRow>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            setVisible(true);
            if (isFirstMount) {
              loadComments();
              setHadMounted(true);
              setIsFirstMount(false);
            }
            if (anchorEl) handleClose();
          }}
        >
          View post
        </MenuItem>
        {post.reports_count > 0 && (
          <MenuItem onClick={loadReportsCount}>View reports</MenuItem>
        )}
      </Menu>

      <Modal
        show={visible}
        onHide={() => setVisible(false)}
        className={cx("add-employee-modal")}
      >
        <Modal.Header>
          <div className={cx("title-modal")}>POST</div>
        </Modal.Header>
        <Modal.Body>
          <div className={cx("post-image")}>
            <div
              className={cx("image")}
              style={{
                maxHeight: "220px",
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
                    src={image}
                    alt={""}
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
                  {isLastImage === true || images.length === 1 ? null : (
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
          </div>
          <div className={cx("row align-items-center", "modal-content-item")}>
            <div className={cx("col-lg-3 col-md-3", "post-info")}>
              <div style={{ fontWeight: 600, marginRight: "10px" }}>
                {post.creator.username}
              </div>
              <div> {post.content}</div>
            </div>
          </div>
          <div className={cx("row align-items-center", "modal-content-item")}>
            Comments
            <div className={cx("comment")}>
              {comments.length > 0 &&
                comments.map((comment, i) => {
                  if (comments.length === i + 1) {
                    return (
                      <div
                        ref={lastCommentRef}
                        key={comment._id}
                        className={cx("col-lg-3 col-md-3", "post-comment")}
                      >
                        <div style={{ fontWeight: 600, marginRight: "10px" }}>
                          {comment.user.username}
                        </div>
                        <div> {comment.comment}</div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={comment._id}
                      className={cx("col-lg-3 col-md-3", "post-comment")}
                    >
                      <div style={{ fontWeight: 600, marginRight: "10px" }}>
                        {comment.user.username}
                      </div>
                      <div> {comment.comment}</div>
                    </div>
                  );
                })}
              {!commentsLoading && comments.length === 0 && (
                <div style={{ opacity: 0.6 }}> No Comments</div>
              )}
              {commentsLoading && <CircularProgress size={40} />}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div
            style={{
              width: "70%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              className={cx("modal-button")}
              style={{
                backgroundColor: "grey",
                border: "none",
                color: "white",
                borderRadius: "10px",
                cursor: "pointer",
              }}
              onClick={() => setVisible(false)}
            >
              CLOSE
            </button>
            <button
              className={cx("modal-button")}
              style={{
                backgroundColor: isLock ? "green" : "red",
                border: "none",
                color: "white",
                borderRadius: "10px",
                cursor: "pointer",
              }}
              onClick={handleDeletePost}
              disabled={privateHttpRequest.isLoading}
            >
              {isLock ? "UNLOCK" : "LOCK"}
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={viewReports}
        onHide={() => setViewReports(false)}
        className={cx("add-employee-modal")}
      >
        <Modal.Header>
          <div className={cx("title-modal")}>REPORTS</div>
          {privateHttpRequest.error && (
            <>
              <br />
              <div className={cx("title-modal")}>
                {" "}
                <Alert severity="error">{privateHttpRequest.error}</Alert>
              </div>
            </>
          )}
        </Modal.Header>
        <Modal.Body>
          {reportsCount.map((item, i) => (
            <div
              key={i}
              className={cx("row align-items-center", "modal-content-report")}
            >
              <div className={cx("col-lg-8 col-md-8", "report")}>
                {item.reason}
              </div>
              <div className={cx("col-lg-3 col-md-3", "count")}>
                {item.count}
              </div>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PostTableItem;
