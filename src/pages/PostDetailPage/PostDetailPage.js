import React, { useRef } from "react";
import classNames from "classnames/bind";
import styles from "./PostDetailPage.module.scss";
import Sidenav from "../../shared/components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import TimeAgo from "../../shared/components/TimeAgo";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ReactIcon from "../../components/ReactIcon/ReactIcon";
import CommentInput from "../../components/Comment/CommentInput";
const cx = classNames.bind(styles);

function PostDetailPage() {
  const navigate = useNavigate();

  return (
    <div className={cx("postpage")}>
      <div className={cx("postpage__navWraper")}>
        <Sidenav/>
      </div>
      <div className={cx("postpage__content")}>
        <div className={cx("container-post")}>
            <div className={cx("image-post")} style={{}}>
                {/* {post?.media.map((image, index) => ( */}
                <div
                    // key={index}
                    className={cx("img-post-slider")}
                    style={{
                    width: "100%",
                    height: "100%",
                    // transform: `translateX(-${100 * imageIndex}%)`,
                    transition: "transform 0.2s",
                    display: "flex",
                    flexShrink: "0",
                    flexGrow: "0",
                    borderRadius: "10px 0px 0px 10px",
                    }}
                    // aria-hidden={imageIndex !== index}
                >
                    <img
                    style={{
                        width: "100%",
                        objectFit: "contain",
                        height: "auto",
                        display: "block",
                        flexShrink: "0",
                        flexGrow: "0",
                        borderRadius: "10px 0px 0px 10px",
                    }}
                    src="data:image/jpeg;base64,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vgt0kAZOwQjzl8enggGPTuWM1EIdymWMO7gXjJWXIIBG6K0rvaLfeqN1HdaSKqp3blkjc7+I8FHaa0dY9Ly1MtkozTuqcdr9q5wOOgAJwOvcp5EBERAREQFAaz01Fqa1inM3s1XC8S0lUwZdDIOh/up4nH91jM8IJzLG0jbd4ygq2j9Q1MtbUae1DysvlGObmaMMqou6Vv8AUeKtq59xAqqQ6j0u+2zwyXuOuDWxRPBeYHA8/MBvy7emV0JUeIiIoiIgIiIgiIgJhEQF8yxRzRujlY18bhhzXDII819IgoVXwyooax9Vpy611kmkOXtpX5Y8+bSg4d1FWWG86svdWG7GOOQQsPry4V9RDSjjhPo8Nw63yvd+N07i765WpNprUelHe06RuMldSA5fa7hIXjH/AK3bkei6GiDn9FxasbXinv8ABWWasA9+KpgdgHyI/sph3EbRwZ2n+IaHl8A45+mMqw1dFSV0fZ1tNDUM/DNGHj81oM0xp+OQyMsdtDz972Vmf0QVuTihbal7maetd1vZacOdR0riwH1IWF3E51BIBf8AS15tsZ6yuhL2geJI+a6AxoY0NYA1o2AGwCEAjlIBB6g96CrUPEfR9awOjv8ARx5+7O/syP8Adhat44lWSmAp7JL+3LlLtDSW/wC0Lj4kjYAKeqdNWCqk7Spstvlf+J1MzP6LboLbQW5nJb6KnpWHqIIgzP0QUWHS2pNUuZWauu8tDC/BZa7dJyhnk543J9F9u4PaSkPPIyte47uc6rcST49V0HCd2EEBp7Rmn9OSOltVvjjnd1mceZ/1Kn0RARERRERARERBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//9k="
                    // src={image}
                    />
                    {/* {isFirstImage === true ||
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
                    )} */}
                </div>
                {/* ))} */}
            </div>
            <div
                className={cx("post-caption")}
                style={{ position: "relative" }}
            >
            <div className={cx("postInfo-user")}>
                <div style={{ alignItems: "center", display: "flex", marginLeft: "10px" }}>
                    <Link
                    // to={`/${post.creator?.username}`}
                    className={cx("postInfo-user-avatar")}
                    style={{
                        position: "inherit",
                        textDecoration: "none",
                        color: "inherit",
                    }}
                    >
                    <img
                        style={{ width: "30px", height: "30px" }}
                        src="data:image/jpeg;base64,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vgt0kAZOwQjzl8enggGPTuWM1EIdymWMO7gXjJWXIIBG6K0rvaLfeqN1HdaSKqp3blkjc7+I8FHaa0dY9Ly1MtkozTuqcdr9q5wOOgAJwOvcp5EBERAREQFAaz01Fqa1inM3s1XC8S0lUwZdDIOh/up4nH91jM8IJzLG0jbd4ygq2j9Q1MtbUae1DysvlGObmaMMqou6Vv8AUeKtq59xAqqQ6j0u+2zwyXuOuDWxRPBeYHA8/MBvy7emV0JUeIiIoiIgIiIgiIgJhEQF8yxRzRujlY18bhhzXDII819IgoVXwyooax9Vpy611kmkOXtpX5Y8+bSg4d1FWWG86svdWG7GOOQQsPry4V9RDSjjhPo8Nw63yvd+N07i765WpNprUelHe06RuMldSA5fa7hIXjH/AK3bkei6GiDn9FxasbXinv8ABWWasA9+KpgdgHyI/sph3EbRwZ2n+IaHl8A45+mMqw1dFSV0fZ1tNDUM/DNGHj81oM0xp+OQyMsdtDz972Vmf0QVuTihbal7maetd1vZacOdR0riwH1IWF3E51BIBf8AS15tsZ6yuhL2geJI+a6AxoY0NYA1o2AGwCEAjlIBB6g96CrUPEfR9awOjv8ARx5+7O/syP8Adhat44lWSmAp7JL+3LlLtDSW/wC0Lj4kjYAKeqdNWCqk7Spstvlf+J1MzP6LboLbQW5nJb6KnpWHqIIgzP0QUWHS2pNUuZWauu8tDC/BZa7dJyhnk543J9F9u4PaSkPPIyte47uc6rcST49V0HCd2EEBp7Rmn9OSOltVvjjnd1mceZ/1Kn0RARERRERARERBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//9k="
                        // src={avatarUrl}
                        // alt={post.creator.username + " avatar"}
                    />
                    </Link>
                </div>
                <div className={cx("postInfo-user-info")}>
                    <Link
                    // to={`/${post.creator?.username}`}
                    style={{
                        position: "inherit",
                        textDecoration: "none",
                        color: "inherit",
                    }}
                    >
                    <span className={cx("postInfo-username")}>
                        duong
                        {/* {post.creator.username} */}
                    </span>
                    </Link>
                </div>
            </div>
            <div className={cx("post-comment")}>
                <div className={cx("post-comment-user")}>
                    <div className={cx("post-comment-user-avatar")}>
                    <img
                        style={{ width: "30px", height: "30px" }}
                        src="data:image/jpeg;base64,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vgt0kAZOwQjzl8enggGPTuWM1EIdymWMO7gXjJWXIIBG6K0rvaLfeqN1HdaSKqp3blkjc7+I8FHaa0dY9Ly1MtkozTuqcdr9q5wOOgAJwOvcp5EBERAREQFAaz01Fqa1inM3s1XC8S0lUwZdDIOh/up4nH91jM8IJzLG0jbd4ygq2j9Q1MtbUae1DysvlGObmaMMqou6Vv8AUeKtq59xAqqQ6j0u+2zwyXuOuDWxRPBeYHA8/MBvy7emV0JUeIiIoiIgIiIgiIgJhEQF8yxRzRujlY18bhhzXDII819IgoVXwyooax9Vpy611kmkOXtpX5Y8+bSg4d1FWWG86svdWG7GOOQQsPry4V9RDSjjhPo8Nw63yvd+N07i765WpNprUelHe06RuMldSA5fa7hIXjH/AK3bkei6GiDn9FxasbXinv8ABWWasA9+KpgdgHyI/sph3EbRwZ2n+IaHl8A45+mMqw1dFSV0fZ1tNDUM/DNGHj81oM0xp+OQyMsdtDz972Vmf0QVuTihbal7maetd1vZacOdR0riwH1IWF3E51BIBf8AS15tsZ6yuhL2geJI+a6AxoY0NYA1o2AGwCEAjlIBB6g96CrUPEfR9awOjv8ARx5+7O/syP8Adhat44lWSmAp7JL+3LlLtDSW/wC0Lj4kjYAKeqdNWCqk7Spstvlf+J1MzP6LboLbQW5nJb6KnpWHqIIgzP0QUWHS2pNUuZWauu8tDC/BZa7dJyhnk543J9F9u4PaSkPPIyte47uc6rcST49V0HCd2EEBp7Rmn9OSOltVvjjnd1mceZ/1Kn0RARERRERARERBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//9k="
                        // src={avatarUrl}
                        // alt={post.creator.username + " avatar"}
                    />
                    </div>

                    <div className={cx("post-comment-user-info")}>
                    <span className={cx("post-comment-username")}>
                        duong
                        {/* {post.creator.username} */}
                    </span>
                    <span className={cx("post-comment-content")}>
                        duong ne
                        {/* {post.content} */}
                    </span>
                    </div>
                </div>
                {/* {comments.length > 0 &&
                    comments.map((comment, i) => {
                    if (comments.length === i + 1) {
                        return ( */}
                        <div
                            // ref={lastCommentRef}
                            // key={comment._id}
                            className={cx("post-comment-user")}
                        >
                            <div className={cx("post-comment-user-avatar")}>
                            <Link
                                // to={`/${comment.user.username}`}
                                className={cx("post-comment-user-avatar")}
                                style={{
                                position: "inherit",
                                textDecoration: "none",
                                color: "inherit",
                                }}
                            >
                                <img
                                style={{ width: "30px", height: "30px" }}
                                src="data:image/jpeg;base64,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vgt0kAZOwQjzl8enggGPTuWM1EIdymWMO7gXjJWXIIBG6K0rvaLfeqN1HdaSKqp3blkjc7+I8FHaa0dY9Ly1MtkozTuqcdr9q5wOOgAJwOvcp5EBERAREQFAaz01Fqa1inM3s1XC8S0lUwZdDIOh/up4nH91jM8IJzLG0jbd4ygq2j9Q1MtbUae1DysvlGObmaMMqou6Vv8AUeKtq59xAqqQ6j0u+2zwyXuOuDWxRPBeYHA8/MBvy7emV0JUeIiIoiIgIiIgiIgJhEQF8yxRzRujlY18bhhzXDII819IgoVXwyooax9Vpy611kmkOXtpX5Y8+bSg4d1FWWG86svdWG7GOOQQsPry4V9RDSjjhPo8Nw63yvd+N07i765WpNprUelHe06RuMldSA5fa7hIXjH/AK3bkei6GiDn9FxasbXinv8ABWWasA9+KpgdgHyI/sph3EbRwZ2n+IaHl8A45+mMqw1dFSV0fZ1tNDUM/DNGHj81oM0xp+OQyMsdtDz972Vmf0QVuTihbal7maetd1vZacOdR0riwH1IWF3E51BIBf8AS15tsZ6yuhL2geJI+a6AxoY0NYA1o2AGwCEAjlIBB6g96CrUPEfR9awOjv8ARx5+7O/syP8Adhat44lWSmAp7JL+3LlLtDSW/wC0Lj4kjYAKeqdNWCqk7Spstvlf+J1MzP6LboLbQW5nJb6KnpWHqIIgzP0QUWHS2pNUuZWauu8tDC/BZa7dJyhnk543J9F9u4PaSkPPIyte47uc6rcST49V0HCd2EEBp7Rmn9OSOltVvjjnd1mceZ/1Kn0RARERRERARERBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//9k="
                                // src={getAvatarUrl(
                                //     comment.user.profile_picture
                                // )}
                                alt=""
                                />
                            </Link>
                            </div>
                            <div className={cx("post-comment-user-info")}>
                            <Link
                                // to={`/${comment.user.username}`}
                                style={{
                                position: "inherit",
                                textDecoration: "none",
                                color: "inherit",
                                }}
                            >
                                <span className={cx("post-comment-username")}>
                                    duong
                                {/* {comment.user.username} */}
                                </span>
                            </Link>
                            <span className={cx("post-comment-content")}>
                                duong ne
                                {/* {comment.comment} */}
                            </span>
                            </div>
                        </div>
                        {/* );
                    }
                    return (
                        <div
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
                                src={getAvatarUrl(
                                comment.user.profile_picture
                                )}
                                alt=""
                            />
                            </Link>
                        </div>
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
                        </div>
                    );
                    })} */}
                {/* {commentsLoading && <CircularProgress size={40} />} */}
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
                        // userId={[post.creator._id]}
                        // postId={post._id}
                        // isLiked={isLiked}
                        // setIsLiked={setIsLiked}
                        // setReactsCount={setReactsCount}
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
                    <span>
                        {/* {reactsCount}  */}
                    2 likes</span>
                    <br />
                    <span
                    style={{
                        color: grey[600],
                        fontSize: 10,
                        textTransform: "uppercase",
                    }}
                    >
                    <TimeAgo created_at="2h"
                    // {post.created_at} 
                    />
                    </span>
                </div>

                <CommentInput
                    // postId={post._id}
                    // userId={post.creator._id}
                    // setComments={setComments}
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
      </div>
    </div>
  );
}

export default PostDetailPage;
