import classNames from "classnames/bind";
import { React, useState } from "react";
import styles from "./GroupInvited.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import getAvatarUrl from "../../shared/util/getAvatarUrl";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { deleteToGroup, acceptToGroup } from "../../services/groupService";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);
function GroupInvited({ group }) {

    const privateHttpRequest = usePrivateHttpClient();
    const [loading, setLoading] = useState(false)
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
            try {
                const respone = await acceptToGroup(
                group._id,
                privateHttpRequest.privateRequest
                );
                if (respone !== null) {
                setStatus("Accepted");
                setLoading(false);
                }
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
                alignItems: "center"
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
                    style={{ width: "44px", height: "44px" }}
                    src={getAvatarUrl(group.groupImage)}
                    alt=""
                />
                </Link>
            </div>
            <div className={cx("modal__group__info")}>
                <Link
                    // to={`/${props.groupId}`}
                    style={{
                        position: "inherit",
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    <span className={cx("modal__group__username")}>
                        {group.name}
                    </span>
                </Link>
            </div>
            <div>
                {status !== "" ? (<span>{status}</span>) : (
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