import React, { useEffect, useState } from "react";
import Post from "../Post/Post";
import Suggestions from "../Suggestions/Suggestions";
import classNames from "classnames/bind";
import styles from "./TimeLine.scss";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { getHomePosts } from "../../services/postServices";

const cx = classNames.bind(styles);

function TimeLine() {
  const privateHttpRequest = usePrivateHttpClient();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const data = await getHomePosts(
        page,
        10,
        privateHttpRequest.privateRequest
      );

      if (data.posts.length > 0) {
        setPosts((prevPosts) => {
          const newPostIds = new Set(data.posts.map((p) => p._id));

          // Lọc các bài viết mới chưa có trong prevPosts
          const uniqueNewPosts = data.posts.filter(
            (newPost) =>
              !prevPosts.some((prevPost) => prevPost._id === newPost._id)
          );

          return [...prevPosts, ...uniqueNewPosts];
        });
      }
      setHasMore(data.posts.length > 0);
    };
    getPosts();
  }, [page]);

  return (
    <div className={cx("timeline")}>
      <div className={cx("timeline__left")}>
        <div className={cx("timeline__posts")}>
          {posts.length > 0 && posts.map((post) => <Post post={post} />)}
        </div>
      </div>
      <div className={cx("timeline__right")}>
        <Suggestions />
      </div>
    </div>
  );
}

export default TimeLine;
