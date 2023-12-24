import { useContext, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { reactPost } from "../../services/postServices";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { pink } from "@mui/material/colors";
import { StateContext } from "../../context/StateContext";
import { updateReactsCount } from "../../context/StateAction";

const ReactIcon = (props) => {
  const privateHttpRequest = usePrivateHttpClient();
  const { user, socket, dispatch } = useContext(StateContext);

  useEffect(() => {
    dispatch(
      updateReactsCount({
        postId: props.postId,
        reactsCount: props.reactsCount,
      })
    );
  }, [props.reactsCount]);

  const handleReactPost = async () => {
    try {
      props.setIsLiked(!props.isLiked);
      if (!props.isLiked) props.setReactsCount((prev) => ++prev);
      else props.setReactsCount((prev) => --prev);

      const response = await reactPost(
        { postId: props.postId, emoji: "LOVE" },
        privateHttpRequest.privateRequest
      );
      if(response){
        socket.current.emit("sendNotification", {
          sender_id: user?._id,
          receiver_id: props.userId,
          content_id: props.postId,
          type: "like",
        });
      }
    } catch (err) {
    }
  };
  return (
    <div onClick={handleReactPost} className={props.className}>
      {props.isLiked ? (
        <FavoriteIcon sx={{ color: pink[500] }} />
      ) : (
        <FavoriteBorderIcon />
      )}
    </div>
  );
};

export default ReactIcon;
