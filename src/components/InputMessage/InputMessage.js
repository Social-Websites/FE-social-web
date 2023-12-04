import React, { useContext, useState, useRef, useEffect } from "react";
import style from "./InputMessage.module.scss";
import classNames from 'classnames/bind';
import EmojiPicker from 'emoji-picker-react';
import SendIcon from '@mui/icons-material/Send';
import { CircularProgress} from "@mui/material";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CloseIcon from '@mui/icons-material/Close';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { StateContext } from "../../context/StateContext";
import * as messageService from "../../services/messageService"
import * as conversationService from "../../services/conversationService"
import { storage, ref, getDownloadURL, uploadBytesResumable } from "../../config/firebase";


const cx = classNames.bind(style);

function InputMessage ({onSelectedFile}) {
  const [text, setText] = useState("");
  const [img, setImg] = useState([]);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [sending, setSending] = useState(false);
  

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

  const handleSendIcon = async () => {
    console.log(currentChat);
    try{
      const newMessage = {
        conversationId: currentChat._id,
        recieve_ids: currentChat.userIds,
        sender_id: user._id,
        img: user.profile_picture,
        content: "❤️",
        media: img,
      }
      const result =  await messageService.sendMessage(newMessage);
      socket.current.emit("send-msg", newMessage)
      dispatch({ type: "FIRST_CONVERSATION", payload: currentChat });
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
  }


  const handleCreateConversationWithIcon = async () => {
    console.log(currentChat);
    try{
      const newConversation = {
        userIds: [...currentChat.userIds, user._id],
      };
      const con = await conversationService.createConversation(newConversation);
      const newCon = {
        _id: con._id,
        userIds: currentChat.userIds, 
        name: currentChat.name, 
        img: currentChat.img, 
        lastMsg: "You: ❤️",
      }
      
      dispatch({ type: "ADD_CONVERSATION", payload: newCon });
      dispatch({ type: "CURRENT_CHAT", payload: newCon });
      
      const newMessage = {
        conversationId: currentChat._id,
        recieve_ids: currentChat.userIds,
        sender_id: user._id,
        img: user.profile_picture,
        content: "❤️",
        media: img,
      }
      const result =  await messageService.sendMessage(newMessage);
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
  }


  const handleSendMessage = async () => {
    // const promises = [];
    const promises = img.map((image) => {
      const name = Date.now();
      const storageRef  = ref(storage,`images/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, image.file);
      // promises.push(uploadTask);
      // console.log(promises);
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            console.log(error);
            reject(error);
          },
          () => {
            console.log("Toi r");
            getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              console.log(url);
              resolve(url);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
          }
        );
      });
    });
    
    try{
      setSending(true);
      const urls = await Promise.allSettled(promises)
      const urlStrings = urls.map((url) => url.value.toString());
      console.log(currentChat);
      try{
          const newMessage = {
          conversationId: currentChat._id,
          recieve_ids: currentChat.userIds,
          sender_id: user._id,
          img: user.profile_picture,
          content: text,
          media: urlStrings,
        };
        const result = await messageService.sendMessage(newMessage);
        socket.current.emit("send-msg", newMessage)
        dispatch({ type: "FIRST_CONVERSATION", payload: currentChat });
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
    } catch (err) {
      console.log(err);
    } finally {
      setSending(false);
    }
    await ReturnHeight();
  };



  const handleCreateConversationWithMsg = async () => {
    // const promises = [];
    const promises = img.map((image) => {
      const name = Date.now();
      const storageRef  = ref(storage,`images/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, image.file);
      // promises.push(uploadTask);
      // console.log(promises);
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            console.log(error);
            reject(error);
          },
          () => {
            console.log("Toi r");
            getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              console.log(url);
              resolve(url);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
          }
        );
      });
    });
    
    try{
      setSending(true);
      const urls = await Promise.allSettled(promises)
      const urlStrings = urls.map((url) => url.value.toString());
      console.log(currentChat);
      try{
        const newConversation = {
          userIds: [...currentChat.userIds, user._id],
        };
        const con = await conversationService.createConversation(newConversation);
        let newCon;
        if(urlStrings)
          newCon = {
            _id: con._id,
            userIds: currentChat.userIds, 
            name: currentChat.name, 
            img: currentChat.img, 
            lastMsg: "You: Image",
          }
        else
          newCon = {
            _id: con._id,
            userIds: currentChat.userIds, 
            name: currentChat.name, 
            img: currentChat.img, 
            lastMsg: "You: " + text,
          }
        
        dispatch({ type: "ADD_CONVERSATION", payload: newCon });
        dispatch({ type: "CURRENT_CHAT", payload: newCon });

        const newMessage = {
          conversationId: con._id,
          recieve_ids: currentChat.userIds,
          sender_id: user._id,
          img: user.profile_picture,
          content: text,
          media: urlStrings,
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
    } catch (err) {
      console.log(err);
    } finally {
      setSending(false);
    }
    await ReturnHeight();
  };


  const handleEnter = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của phím Enter (như xuống dòng)
      console.log("Enter .....");
      if(currentChat._id)
        if((text.trim() !== "" || img.length != 0) && sending == false){
          await handleSendMessage();
        }
      else
        if((text.trim() !== "" || img.length != 0) && sending == false){
          await handleCreateConversationWithMsg();
        }
    }
  };

  function selectFiles() {
    fileInputRef.current.click();
  }
  async function onFileSelect(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!img.some((e) => e.name === files[i].name)) {
        setImg((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
            file: files[i],
          },
        ]);
      }
    
    await ReturnHeight();
      
    }
  }

  async function ReturnHeight() {
    let isSelectedFile = 4;
    console.log(img.length)
    if(img.length % 12 === 0){
      isSelectedFile = 3 ;
    }
    else if(img.length % 11 === 0 ){
      isSelectedFile = 2 ;
    }
    else if(img.length === 1) {
      isSelectedFile = 1 ;
    }
    else isSelectedFile = 0 ;
    onSelectedFile(isSelectedFile);
  }
  async function deleteImage(index) {
    setImg((prevImages) => prevImages.filter((_, i) => i !== index));
    await ReturnHeight();
  }

  return (
    <div className={cx("input__message")} style={{height:"auto", marginBottom: "10px"}}>
      {img.length > 0 ? (<div className={cx("images")} style={{height:"auto", display: "flex", flexWrap: "wrap", alignItems: "center"}}>
        {img.map((images, index) => (
          <div key={index} className={cx("image-wrapper")} >
            <img
              style={{
                maxWidth: "48px",
                maxHeight: "48px",
                height: "auto",
                borderRadius: "10px 10px 10px 10px",
              }}
              src={images.url}
              alt={images.name}
            />
            <CloseIcon type="submit" style={{ 
              width: "15px",
              height: "15px",
              color: "white", 
              position: "relative", 
              top: "-25px", right: "10px",
              borderRadius: "50%",
              border: "white solid 1.5px",
              cursor: "pointer",
            }} 
              onClick={() => deleteImage(index)}/>
          </div>
          ))}
          {/* <progress value={progress} max="100" /> */}
      </div>) : null}
      
      <div style={{height:"auto", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div className={cx("input")} id="emoji-open" ref={emojiPickerRef}> 
          <SentimentSatisfiedAltIcon type="submit" style={{color: "white", cursor: "pointer"}} onClick={handleEmojiModal}/>
          {emojiPicker && <div style={{position: "absolute", bottom: 75}}>
            <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" ></EmojiPicker>
            </div>}
          <input
              type="text"
              onKeyUp={handleEnter}
              placeholder="Type something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
          />
          <div className={cx("send")}>
              <input
                accept="image/*"
                type="file"
                multiple
                style={{ display: "none" }}
                id="file"
                ref={fileInputRef}
                onChange={onFileSelect}
              />
              <PhotoOutlinedIcon 
                role="button"
                onClick={selectFiles} 
                style={{color: "white",cursor: "pointer", marginRight: "10px"}}/>
          </div>
          { text || img.length !== 0 ? (sending ? <CircularProgress size={20} /> : <SendIcon type="submit" style={{color: "white", cursor: "pointer"}} onClick={currentChat._id ? handleSendMessage : handleCreateConversationWithMsg}/>) : (<FavoriteBorderOutlinedIcon type="submit" style={{color: "white", cursor: "pointer"}} onClick={currentChat?._id ?  handleSendIcon : handleCreateConversationWithIcon}/>)}
        </div>
      </div>
    </div>
  );
};

export default InputMessage;