import { useCallback, useContext, useEffect, useState } from "react";
import { StateContext } from "../../context/StateContext";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { getHomePosts } from "../../services/postServices";
import { addPosts } from "../../context/StateAction";

const useLoadMorePosts = (page) => {
  const privateHttpRequest = usePrivateHttpClient();

  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { dispatch } = useContext(StateContext);

  const getPosts = useCallback(async () => {
    try {
      setLoadMoreLoading(true);
      const data = await getHomePosts(
        page,
        10,
        privateHttpRequest.privateRequest
      );

      if (data) {
        const postsCount = data.posts.length;

        setHasMore(postsCount > 0 && postsCount === 10);

        if (postsCount > 0) dispatch(addPosts(data.posts));
        setLoadMoreLoading(false);
      }
    } catch (err) {
      setLoadMoreLoading(false);
      console.error(err);
    }
  }, [page]);

  useEffect(() => {
    if (page > 1) getPosts();
  }, [page]);

  return { loadMoreLoading, hasMore };
};

export default useLoadMorePosts;
