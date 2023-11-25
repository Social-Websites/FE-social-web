import { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { reactPost } from "../../services/postServices";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { pink } from "@mui/material/colors";

const ReactIcon = (props) => {
  const privateHttpRequest = usePrivateHttpClient();

  const handleReactPost = async () => {
    try {
      props.setIsLiked(!props.isLiked);
      if (!props.isLiked) props.setReactsCount((prev) => ++prev);
      else props.setReactsCount((prev) => --prev);

      const response = await reactPost(
        { postId: props.postId, emoji: "LOVE" },
        privateHttpRequest.privateRequest
      );
    } catch (err) {}
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
