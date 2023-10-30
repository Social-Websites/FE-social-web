import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Chats.scss";
import Sidenav from "../../shared/components/NavBarMini";
import Chats from "../../components/Chats";
import Messages from "../../components/Messages";
import Input from "../../components/InputMessage";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { StateContext } from "../../context/StateContext";
import { io } from "socket.io-client";

const cx = classNames.bind(styles);
const uId = "6537933675b948b32d19d38c";

function ChatPage() {
  const { currentChat, dispatch } = useContext(StateContext);
  const socket = useRef();
  const [socketEvent, setSocketEvent] = useState(false);

  useEffect(() => {
    if (uId) {
      socket.current = io("http://localhost:3000");
      socket.current.emit("add-user", uId);
      dispatch({ type: "SET_SOCKET", payload: socket });
    }
  }, [uId]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-recieve", (data) => {
        dispatch({
          type: "ADD_MESSAGE",
          payload: data,
        });
      });
      setSocketEvent(true);
    }
  }, [socket.current]);

  return (
    <div className={cx("chatpage")}>
      <div className={cx("chatpage__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("chatpage__sideBar")}>
        <Chats />
      </div>
      {currentChat ? (
        <div className={cx("chatpage__messages")}>
          <div className={cx("chatInfo")}>
            <div className={cx("chatInfo__user")}>
              <span className={cx("chatInfo__user_avatar")}>
                <img
                  style={{ width: "44px", height: "44px" }}
                  src={currentChat?.img}
                  alt=""
                />
              </span>
              <div className={cx("chatInfo__user__info")}>
                <span className={cx("chatInfo__username")}>
                  {currentChat?.name}
                </span>
                <span className={cx("chatInfo__relation")}>
                  New to Instagram
                </span>
              </div>
            </div>
          </div>

          <Messages />
          <Input style={{ bottom: 0 }} />
        </div>
      ) : (
        <div className={cx("chatpage__messages")}>
          <div className={cx("chatpage__messages__main")}>
            <div>
              <div className={cx("chatpage__messages__image")}>
                <ChatOutlinedIcon className={cx("chatpage__messages__logo")} />
              </div>
              <div className={cx("chatpage__messages__text")}>
                Drop photos and videos here
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
