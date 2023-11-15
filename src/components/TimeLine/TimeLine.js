import React, { useState } from "react";
import Post from "../Post/Post";
import Suggestions from "../Suggestions/Suggestions";
import classNames from "classnames/bind";
import styles from "./TimeLine.scss";

const cx = classNames.bind(styles);

function TimeLine() {
  const [posts, setPosts] = useState([
    {
      user: { username: "danhnguyen1" },
      media:["https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg","https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",],
        
      likes: 54,
      timestamp: "2d",
    },
    {
      user: { username: "johndoe" },
      media:[
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"],
      likes: 432,
      timestamp: "2d",
    },
    {
      user: { username: "mariussss" },
      media:[
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"],
      likes: 140,
      timestamp: "2d",
    },
    {
      user: { username: "kobee_18" },
      media:[
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"],
      likes: 14,
      timestamp: "2d",
    },
  ]);

  return (
    <div className={cx("timeline")}>
      <div className={cx("timeline__left")}>
        <div className={cx("timeline__posts")}>
          {posts.map((post) => (
            <Post post={post} />
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
