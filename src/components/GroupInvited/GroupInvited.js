import classNames from "classnames/bind";
import { React, useState, useContext } from "react";
import styles from "./GroupInvited.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { deleteToGroup, acceptToGroup } from "../../services/groupService";
import { StateContext } from "../../context/StateContext";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);
function GroupInvited({ group, setMemberGroups }) {

    const privateHttpRequest = usePrivateHttpClient();
    const [loading, setLoading] = useState(false)
    const {user, socket} = useContext(StateContext);
    const [status, setStatus] = useState("")
    const handleDeleteToGroup = async () => {
        if(!loading){
            setLoading(true);
            try {
                const respone = await deleteToGroup(
                group._id,
                privateHttpRequest.privateRequest
                );
                if (respone !== null) {
                    setStatus("Rejected");
                    setLoading(false);
                    socket.current.emit("sendNotification", {
                        sender_id: user._id,
                        receiver_id: [group.owner],
                        group_id: group._id,
                        reponse: false,
                        type: "rejectGroup",
                    });
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }
    };

    const handleAcceptToGroup = async () => {
        if(!loading){
            setLoading(true);
            console.log(group._id);
            try {
                const respone = await acceptToGroup(
                group._id,
                privateHttpRequest.privateRequest
                );
                if (respone !== null) {
                    setStatus("Accepted");
                    const newgroup = {_id: group._id, name: group.name, cover: group.cover, status: "MEMBER"}
                    setMemberGroups(prev => [...prev, newgroup])
                    setLoading(false);
                    socket.current.emit("sendNotification", {
                        sender_id: user._id,
                        receiver_id: [group.owner],
                        group_id: group._id,
                        reponse: true,
                        type: "acceptGroup",
                      });
                }
                console.log(respone);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }
    };
    return (
        <div className={cx("modal__group")}>
            <div style={{
                display: "flex",
                alignItems: "center",
            }}>
                <Link
                    // to={`/${props.groupId}`}
                    className={cx("modal__group_avatar")}
                    style={{
                        position: "inherit",
                        textDecoration: "none",
                        color: "inherit",
                }}
                >
                <img
                    style={{ width: 44, height: 44 }}
                    src={getAvatarUrl(group.cover)}
                    alt=""
                />
                </Link>
            </div>
            <div className={cx("modal__group__info")}>
                    <span className={cx("modal__group__username")}>
                        {group.name}
                    </span>
            </div>
            <div style={status !== "" ? {display: "flex", alignItems: "center"} : null}>
                {status !== "" ? (<span style={{fontWeight: 600, fontSize: 14, color: "white",
                    fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`
                }}>{status}</span>) : (
                    <>
                    <button
                    onClick={handleAcceptToGroup}
                    className={cx("modal__group__button__accept")}
                    
                    >
                    <CheckIcon />
                    </button>
                    <button
                    onClick={handleDeleteToGroup}
                    className={cx("modal__group__button")}
                    
                    >
                    <ClearIcon />
                    </button>
                </>
                )}
                
            </div>
        </div>
    );
}

export default GroupInvited;