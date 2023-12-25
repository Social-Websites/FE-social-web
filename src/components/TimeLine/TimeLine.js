import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Post from "../Post/Post";
import GroupPost from "../GroupPost";
import Suggestions from "../Suggestions/Suggestions";
import classNames from "classnames/bind";
import styles from "./TimeLine.scss";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { getHomePosts } from "../../services/postServices";
import { StateContext } from "../../context/StateContext";
import { setPosts } from "../../context/StateAction";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { CircularProgress } from "@mui/material";
import useLoadMorePosts from "./Load-more-hook";

const cx = classNames.bind(styles);

const TimeLine = () => {
  const privateHttpRequest = usePrivateHttpClient();
  const [page, setPage] = useState(1);
  const { loadMoreLoading, hasMore } = useLoadMorePosts(page);
  const { posts, dispatch } = useContext(StateContext);

  const observer = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (loadMoreLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Last post");
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadMoreLoading, hasMore]
  );

  const getPosts = useCallback(async () => {
    try {
      const data = await getHomePosts(1, 10, privateHttpRequest.privateRequest);

      const postsCount = data.posts.length;

      if (postsCount > 0 && page === 1) dispatch(setPosts(data.posts));
    } catch (err) {
      console.error(err);
    }
  }, []);
  useEffect(() => {
    if (page === 1) getPosts();
  }, []);

  const postsArray = [...posts.entries()];

  return (
    <div className={cx("timeline")}>
      <div className={cx("timeline__left")}>
        <div className={cx("timeline__posts")}>
          {privateHttpRequest.isLoading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress size={50} />
            </div>
          ) : postsArray.length > 0 ? (
            postsArray.map(([postId, post], i) => {
              if (post?.group) {
                if (postsArray.length === i + 1)
                  return (
                    <GroupPost ref={lastPostRef} key={postId} post={post} />
                  );
                return <GroupPost key={postId} post={post} />;
              } else {
                if (postsArray.length === i + 1)
                  return <Post ref={lastPostRef} key={postId} post={post} />;
                return <Post key={postId} post={post} />;
              }
            })
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
          {loadMoreLoading && <CircularProgress size={50} />}
          {!hasMore && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <span style={{ color: "white", fontSize: 20, fontWeight: 600 }}>
                Add more friends to see more posts
              </span>
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
