import React, { useContext, useEffect, useState } from "react";
import Post from "../Post/Post";
import Suggestions from "../Suggestions/Suggestions";
import classNames from "classnames/bind";
import styles from "./TimeLine.scss";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { getHomePosts } from "../../services/postServices";
import { StateContext } from "../../context/StateContext";
import { addPosts, setPosts } from "../../context/StateAction";

const cx = classNames.bind(styles);

function TimeLine() {
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

      setHasMore(postsCount > 0);
    };
    getPosts();
  }, [page]);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  const postsArray = [...posts.entries()];

  return (
    <div className={cx("timeline")}>
      <div className={cx("timeline__left")}>
        <div className={cx("timeline__posts")}>
          {!privateHttpRequest.isLoading &&
            postsArray.map(([postId, post]) => (
              <Post key={postId} post={post} />
            ))}
        </div>
      </div>
      <div className={cx("timeline__right")}>
        <Suggestions />
      </div>
    </div>
  );
}

export default TimeLine;
