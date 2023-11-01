import React, { useContext, useState, useRef, useEffect } from "react";
import style from "./InputMessage.module.scss";
import classNames from 'classnames/bind';
import EmojiPicker from 'emoji-picker-react';
import SendIcon from '@mui/icons-material/Send';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import { StateContext } from "../../context/StateContext";
import * as messageService from "../../services/messageService"


const cx = classNames.bind(style);

function InputMessage () {
  const [text, setText] = useState("");
  const [img, setImg] = useState([]);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const  {user, currentChat, socket, dispatch}  = useContext(StateContext);

  useEffect (() => {
    const handleOutsideClick = (event) => {
      if(event.target.id !== "emoji-open"){
        if( emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)){
          setEmojiPicker(false);
        }
      }
    }
    
    document.addEventListener("click", handleOutsideClick);
    return() => {
      document.removeEventListener("click", handleOutsideClick);
    }
  }, []);

  const handleEmojiModal = () => {
    setEmojiPicker(!emojiPicker);
  }

  const handleEmojiClick = (emoji) => {
    setText((prevText) => (prevText += emoji.emoji))
  }

  const handleSendMessage = async () => {
    try{
      const newMessage = {
        conversationId: currentChat._id,
        recieve_ids: currentChat.userIds,
        sender_id: user._id,
        img: user.profile_picture,
        content: text,
        // media: img,
      };
      const result = await messageService.sendMessage(newMessage);
      socket.current.emit("send-msg", newMessage)
      dispatch({type: "ADD_MESSAGE", payload: newMessage,
        fromSelf: true,
      })
      if (result !== null) {
        setText("") ;
        setImg([]);
      }
    } catch (err) {
      console.log(err);
    }
};

  return (
    <div style={{height:"75px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div className={cx("input")} id="emoji-open" ref={emojiPickerRef}> 
          <SentimentSatisfiedAltIcon type="submit" style={{color: "white"}} onClick={handleEmojiModal}/>
          {emojiPicker && <div style={{position: "absolute", bottom: 75}}>
            <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" ></EmojiPicker>
            </div>}
          <input
              type="text"
              placeholder="Type something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
          />
          <div className={cx("send")}>
              <input
                type="file"
                style={{ display: "none" }}
                id="file"
                onChange={(e) => setImg(e.target.files[0])}
              />
              <PhotoOutlinedIcon htmlFor="file" style={{color: "white"}}/>
          </div>
          <SendIcon type="submit" style={{color: "white"}} onClick={handleSendMessage}/>
      </div>
    </div>
  );
};

export default InputMessage;