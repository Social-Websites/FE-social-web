import React, { useState, useCallback, useEffect } from "react";
import classNames from 'classnames/bind';
import styles from "./PostRequest.module.scss";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const cx = classNames.bind(styles);
function PostRequest({post}) {
    const avatarUrl =
    post.creator.profile_picture === ""
      ? "/static-resources/default-avatar.jpg"
      : post.creator.profile_picture;

    const [imageIndex, setImageIndex] = useState(0);
    const [isFirstImage, setIsFirstImage] = useState(true);
    const [isLastImage, setIsLastImage] = useState(false);
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
                    &nbsp;
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
                </div>
            </div>
            <div className={cx("post__image")}>
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
            </div>
            <div className={cx("post__footer")}>
                <button className={cx("footer__button__accept")} 
                    // onClick={toggleModalInvite}
                >
                    <span>Accept</span>
                </button>
                <button className={cx("footer__button")} 
                    // onClick={toggleModalInvite}
                >
                    <span>Reject</span>
                </button>
            </div>
        </div>
    );
}

export default PostRequest;