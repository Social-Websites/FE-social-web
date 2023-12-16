import { useContext, useEffect, useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { savePost } from "../../services/postServices";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { pink } from "@mui/material/colors";
import { StateContext } from "../../context/StateContext";
import { setSavedPost } from "../../context/StateAction";
import { CircularProgress } from "@mui/material";

const SavePostIcon = (props) => {
  const privateHttpRequest = usePrivateHttpClient();
  const { user, socket, dispatch } = useContext(StateContext);
  const [saving, setSaving] = useState(false);

  const handleSavePost = async () => {
    if (!saving) {
      let message;
      try {
        setSaving(true);
        const response = await savePost(
          props.postId,
          !props.isSaved,
          privateHttpRequest.privateRequest
        );
        if (response.message) {
          dispatch(
            setSavedPost({
              postId: props.postId,
              isSaved: !props.isSaved,
            })
          );
          props.setIsSaved(!props.isSaved);
          setSaving(false);
          if (!props.isSaved) message = "Saved post success!";
          else message = "UnSaved post success!";
          props.setSnackBarNotif({
            severity: "success",
            message: message,
          });

          props.setSnackBarOpen(true);
        }
      } catch (err) {
        setSaving(false);
        if (!props.isSaved) message = "Saved post fail!";
        else message = "UnSaved post fail!";
        props.setSnackBarNotif({
          severity: "error",
          message: message,
        });
        props.setSnackBarOpen(true);
      }
    }
  };
  return (
    <div
      onClick={handleSavePost}
      style={props.style}
      className={props.className}
    >
      {saving ? (
        <CircularProgress size={10} />
      ) : props.isSaved ? (
        <BookmarkAddedIcon />
      ) : (
        <BookmarkBorderIcon />
      )}
    </div>
  );
};

export default SavePostIcon;
