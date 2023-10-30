import classNames from "classnames/bind";
import { useState, useEffect, React } from "react";
import styles from "./Chats.scss";
import ConversationChat from "./ConversationChat/ConversationChat";
import * as conversationService from "../../services/conversationService";

const cx = classNames.bind(styles);
const uId = "6537933675b948b32d19d38c";
function Chats() {
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await conversationService.getUserConversations(uId);
        setConversation(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={cx("chats")}>
      {/* {notifications.map((n) => displayNotification(n))} */}
      <div className={cx("chats__title")}>
        <span>duongw</span>
      </div>
      <div className={cx("chats__input")}>
        <input type="text" placeholder="Search" />
      </div>
      <div className={cx("chats__messages")}>Messages</div>
      <div className={cx("chats__content")}>
        {conversation.map((con) => (
          <ConversationChat
            name={con.name}
            img={con.img}
            lastMsg={con.lastMsg}
            key={con._id}
          />
        ))}
      </div>
    </div>
  );
}
export default Chats;
