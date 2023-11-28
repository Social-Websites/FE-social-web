import classNames from 'classnames/bind';
import {useState, useEffect, useContext, useRef , React } from "react";
import styles from "./Chats.scss";
import ConversationChat from "./ConversationChat/ConversationChat";
import * as conversationService from '../../services/conversationService';
import { StateContext } from "../../context/StateContext";
import SearchUserLoading from "../SearchUserLoading";


const cx = classNames.bind(styles);
function Chats() {

    const [conversations, setConversation] = useState([])
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const  {user, dispatch}  = useContext(StateContext);

    const searchCons = async (e) => {
        const data = e.target.value;
        try {
          const result = await conversationService.searchCons(user._id,data);
          console.log(result);
          if (result !== null) {
            setConversation(result);
            setIsLoadingSearch(false);
          }
        } catch (err) {
          console.log(err);
        }
      };
      const debounce = (fn, delay) => {
        let timerId = null;
    
        return function (...args) {
          setIsLoadingSearch(true);
          clearTimeout(timerId);
    
          timerId = setTimeout(() => {
            fn.apply(this, args);
          }, delay);
        };
      };

      const debouncedSearchCons = debounce(searchCons, 500);


    useEffect(() => {
        if(user){
            const fetchData = async () => {
                try {
                    const data = await conversationService.getUserConversations(user._id);
                    setConversation(data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }
    }, [user]);

    function handleClick(con) {
        dispatch({ type: "CURRENT_CHAT", payload: con });
        console.log("Chon conversation")
    };

    
    return (
        <div className={cx("chats")} >
            {/* {notifications.map((n) => displayNotification(n))} */}
            <div className={cx("chats__title")}>
                <span >{user?.username}</span>
            </div>
            <div className={cx("chats__input")}>
                <input type="text"  placeholder="Search" onChange={debouncedSearchCons}/>
            </div>
            <div className={cx("chats__messages")}>
                Messages
            </div>
            <div className={cx("chats__content")} >
                {isLoadingSearch ? (
                <SearchUserLoading />
                ) : (
                conversations.length > 0 ? (conversations.map((con) => (
                    <ConversationChat 
                        key={con._id}
                        c={con}
                        onClick={() => handleClick(con)}
                    />
                ))) : (<div style={{display: "flex",justifyContent: "center"}}>
                    <span style={{
                        color: "#A8A8A8",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                        fontWeight: "500",
                        fontSize: "14px"
                    }}
                    >No messages
                    </span>
                </div>))}
            </div>
        </div>
    )
}
export default Chats;