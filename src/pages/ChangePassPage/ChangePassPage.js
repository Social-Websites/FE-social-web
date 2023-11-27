import React, {useContext} from "react";
import classNames from 'classnames/bind';
import styles from "./ChangePassPage.module.scss";
import Sidenav from "../../shared/components/NavBar";
import Setting from "../../components/Setting";
import { StateContext } from "../../context/StateContext"

const cx = classNames.bind(styles);

function ChangePassPage() {
    const { user } = useContext(StateContext);
    
    return (
        <div className={cx("editProfilePage")}>
            <div className={cx("editProfile__navWraper")}>
                <Sidenav />
            </div>
            <div className={cx("editProfile__sideBar")}>
                <Setting/>
            </div>
            <div className={cx("editProfile__content")}>
                <div className={cx("editProfile__content__main")}>
                    <div className={cx("editProfile__content__title")}>Change Password</div>
                    <div className={cx("editProfile__content__info")}>
                        <div className={cx("editProfile__content__info__subject")}>
                            <span>Old Password</span>
                        </div>
                        <div className={cx("editProfile__content__info__textarea")}>
                            <input
                            placeholder="Old Password..."
                            >
                            </input>
                        </div>
                    </div>
                    <div className={cx("editProfile__content__info")}>
                        <div className={cx("editProfile__content__info__subject")}>
                            <span>New Password</span>
                        </div>
                        <div className={cx("editProfile__content__info__textarea")}>
                            <input
                            placeholder="New Password..."
                            >
                            </input>
                        </div>
                    </div>
                    <div className={cx("editProfile__content__info")}>
                        <div className={cx("editProfile__content__info__subject")}>
                            <span>Repeat Password</span>
                        </div>
                        <div className={cx("editProfile__content__info__textarea")}>
                            <input
                            placeholder="Repeat Password..."
                            >
                            </input>
                        </div>
                    </div>
                    <div className={cx("editProfile__content__info")}>
                        <div className={cx("editProfile__content__info__subject")}>
                            <span></span>
                        </div>
                        <div className={cx("editProfile__content__info__button")}>
                            <button> Submit </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassPage;