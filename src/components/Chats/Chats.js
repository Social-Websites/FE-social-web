import classNames from 'classnames/bind';
import {useState, useEffect, useContext , React } from "react";
import styles from "./Chats.scss";
import ConversationChat from "./ConversationChat/ConversationChat";
import * as conversationService from '../../services/conversationService';
import { StateContext } from "../../context/StateContext";


const cx = classNames.bind(styles);
function Chats() {

    const [conversations, setConversation] = useState([])
    const  {user}  = useContext(StateContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await conversationService.getUserConversations(user._id);
                console.log(data);
                setConversation(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [user]);

    
    return (
        <div className={cx("chats")} >
            {/* {notifications.map((n) => displayNotification(n))} */}
            <div className={cx("chats__title")}>
                <span >duongw</span>
            </div>
            <div className={cx("chats__input")}>
                <input type="text"  placeholder="Search"/>
            </div>
            <div className={cx("chats__messages")}>
                Messages
            </div>
            <div className={cx("chats__content")} >
                {conversations.map((con) => (
                    <ConversationChat 
                        key={con._id} 
                        c={con}
                    />
                ))}
            </div>
        </div>
    )
}
export default Chats;