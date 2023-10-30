import React, { useContext, useState, useRef } from "react";
import style from "./InputMessage.module.scss";
import classNames from 'classnames/bind';
import SendIcon from '@mui/icons-material/Send';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import { StateContext } from "../../context/StateContext";
import * as messageService from "../../services/messageService"


const cx = classNames.bind(style);

// import {
//   arrayUnion,
//   doc,
//   serverTimestamp,
//   Timestamp,
//   updateDoc,
// } from "firebase/firestore";
// import { db, storage } from "../firebase";
// import { v4 as uuid } from "uuid";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function InputMessage () {
  const text = useRef("");
  const [img, setImg] = useState([]);

  const  {currentChat, socket, dispatch}  = useContext(StateContext);
  const uId="6537933675b948b32d19d38c";

  const handleSendMessage = async () => {
    try{
      const newMessage = {
        conversationId: currentChat._id,
        sender_id: uId,
        content: text.current.value,
        // media: img,
      };
      const result = await messageService.sendMessage(newMessage);
      socket.current.emit("send-msg", newMessage)
      dispatch({type: "ADD_MESSAGE", payload: newMessage,
        fromSelf: true,
      })
      if (result !== null) {
        text.current.value = "";
        setImg([]);
      }
    } catch (err) {
      console.log(err);
    }
};

  return (
    <div style={{height:"75px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div className={cx("input")}>
            <input
                type="text"
                placeholder="Type something..."
                ref={text}
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