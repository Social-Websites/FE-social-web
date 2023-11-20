import React, { useState } from "react";
import Post from "../../components/Post";
import classNames from 'classnames/bind';
import styles from "./GroupPage.module.scss";
import Sidenav from "../../shared/components/NavBar";

const cx = classNames.bind(styles);

function GroupPage() {
    const [posts, setPosts] = useState([
        {
          user: "redian_",
          postImage:
            "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
          likes: 54,
          timestamp: "2d",
        },
        {
          user: "johndoe",
          postImage:
            "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80",
          likes: 432,
          timestamp: "2d",
        },
        {
          user: "mariussss",
          postImage:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
          likes: 140,
          timestamp: "2d",
        },
        {
          user: "kobee_18",
          postImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGCAaQ5u1TMTij5ELPWi5-VPtlSqELw-R6lj0EpYmNcGt56kOQaCokzS0IK81MOSphlkw&usqp=CAU",
          likes: 14,
          timestamp: "2d",
        },
    ]);
  return (
    <div className={cx("group")} style={{backgroundColor: "black", height: "100%"}}>
      <div className={cx("group__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("group__right")}>
        <div className={cx("group__content")}>
          <div className={cx("group__header")}>
            <div className={cx("group_avatar")}>
                <img src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"/>
            </div>
            <div className={cx("group__info")}>
                <div className={cx("group__info__1")}>
                    <div className={cx("group__name")}> 
                        <span>Group lololo</span>
                    </div>
                    <div className={cx("group__follow")}>  
                        <span>0 posts</span>
                        <a className={cx("follow")}>38 follower</a>
                    </div>
                </div>
                <div className={cx("group__info__2")}>
                    <button className={cx("profile__button")}>
                        <span>+ Invite</span>
                    </button>
                </div>
            </div>
        </div>

        <div className={cx("group__posts")}>
            <div className={cx("group__post")} >
                {posts.map((post) => (
                    <Post
                    user={post.user}
                    postImage={post.postImage}
                    likes={post.likes}
                    timestamp={post.timestamp}
                    />
                ))}
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default GroupPage;