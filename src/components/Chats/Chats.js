import classNames from 'classnames/bind';
import {useState, useEffect, useContext, useRef , React } from "react";
import styles from "./Chats.scss";
import ConversationChat from "./ConversationChat/ConversationChat";
import * as conversationService from '../../services/conversationService';
import { StateContext } from "../../context/StateContext";
import SearchUserLoading from "../SearchUserLoading";


const cx = classNames.bind(styles);
function Chats() {
    // const [conversations, setConversation] = useState([])
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [isPetching, setIsPetching] = useState(false);
    const  {conversations, user, socket, currentChat, dispatch}  = useContext(StateContext);
    const socketEventRef = useRef(false);
    const searchCons = async (e) => {
        const data = e.target.value;
        try {
            let result;
            if(data===""){
                result = await conversationService.getUserConversations(user._id);
            } else{
                if(data.trim() !== ""){
                    result = await conversationService.searchCons(user._id, data.trim());
                }    
            }
            console.log(result);
            if (result) {
                dispatch({ type: "SET_CONVERSATIONS", payload: result });
            }
        } catch (err) {
          console.log(err);
        } finally {
            setIsLoadingSearch(false);
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
                    setIsPetching(true);
                    const data = await conversationService.getUserConversations(user._id);
                    dispatch({ type: "SET_CONVERSATIONS", payload: data });
                    // setConversation(data);
                } catch (error) {
                    setIsPetching(false);
                    console.error(error);
                } finally {
                    setIsPetching(false);
                }
            };
            fetchData();
        }
    }, [user]);

    function handleClick(con) {
        if(currentChat !== con){
            dispatch({ type: "CURRENT_CHAT", payload: con });
        }
        console.log("Chon conversation", con._id);
    };

    useEffect(() => {
        // console.log(socket, currentChat._id);
        // console.log(checkCurrentChatIdRef.current);
        if(socket){
          // console.log("toi socket");
          if (socket.current && !socketEventRef.current) {
            socket.current.on("return-recieve", (data) => handleReturnChat(data));
            socketEventRef.current = true;
          }
        }
      }, [socket?.current]);
    
    const handleReturnChat = async (data) => {
        console.log(data);
        // const result = await conversationService.getUserConversations(user._id);
        // console.log(result);
        // dispatch({ type: "SET_CONVERSATIONS", payload: result });
        dispatch({
            type: "ADD_CONVERSATION",
            payload: data
        });
    };
    
    useEffect(() => {
        console.log(conversations);
    }, [conversations]);
    
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
                ) : ( !isPetching ? (
                    conversations && conversations?.length > 0 ? (conversations.map((con) => (
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
                </div>)) : (
                <SearchUserLoading />
                )) }
            </div>
        </div>
    )
}
export default Chats;