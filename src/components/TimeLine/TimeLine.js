import React, { useContext, useEffect, useState } from "react";
import Post from "../Post/Post";
import Suggestions from "../Suggestions/Suggestions";
import classNames from "classnames/bind";
import styles from "./TimeLine.scss";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { getHomePosts } from "../../services/postServices";
import { StateContext } from "../../context/StateContext";
import { addPosts, setPosts } from "../../context/StateAction";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { CircularProgress } from "@mui/material";

const cx = classNames.bind(styles);

const TimeLine = () => {
  const privateHttpRequest = usePrivateHttpClient();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { posts, dispatch } = useContext(StateContext);

  useEffect(() => {
    const getPosts = async () => {
      const data = await getHomePosts(
        page,
        10,
        privateHttpRequest.privateRequest
      );

      const postsCount = data.posts.length;

      if (postsCount > 0 && page === 1) dispatch(setPosts(data.posts));
      else if (postsCount > 0) dispatch(addPosts(data.posts));

      setHasMore(postsCount > 0 && postsCount === 10);
    };
    getPosts();
  }, [page]);

  const postsArray = [...posts.entries()];

  return (
    <div className={cx("timeline")}>
      <div className={cx("timeline__left")}>
        <div className={cx("timeline__posts")}>
          {privateHttpRequest.isLoading ? (
            <CircularProgress size={50} />
          ) : postsArray.length > 0 ? (
            postsArray.map(([postId, post]) => (
              <Post key={postId} post={post} />
            ))
          ) : (
            <div className={cx("no__post")}>
              <div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <ImageNotSupportedIcon
                    style={{ color: "white", width: "100px", height: "100px" }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span style={{ color: "white" }}>
                    Add friends to see posts
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={cx("timeline__right")}>
        <Suggestions />
      </div>
    </div>
  );
};

export default TimeLine;
