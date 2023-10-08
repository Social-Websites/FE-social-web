import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Auth.scss";
import Input from "../../shared/components/FormElement/Input";
import Card from "../../shared/components/UIElement/Card";
import { useForm } from "../../shared/hook/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Button from "../../shared/components/FormElement/Button";
const cx = classNames.bind(styles);



const ForgotPasswordPage = () => {
    const [formState, inputHandler] = useForm({
        username: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    return <div className={cx("back-ground")}>
        <div className={cx("main")}>
            <Card className={cx("center-screen")}>
                <div className={cx("logo--container")}>
                    <span className={cx("lock-icon")}></span>
                </div>
                <div className={cx("logo--container")}>
                    <span dir="auto" style={{fontWeight:600}}>Bạn gặp sự cố khi đăng nhập?</span>
                </div>
                <div className={cx("form--container")}>
                    <form className={cx("form--main")}>
                        <div className={cx("form--separate")}>
                            <div className={cx("input--margin")}>
                                <div className={cx("input--container")}>                                                                       
                                        <Input className={cx("input--user")}
                                        labelClass={cx("input--label")}
                                        spanClass={cx("input--span")}
                                        element="input" 
                                        id="username" 
                                        type="text" 
                                        ariaLabel="Email, điện thoại hoặc tên người dùng" 
                                        ariaRequired="true" 
                                        autocapitalize="off" 
                                        maxlength="75" 
                                        validators={[VALIDATOR_REQUIRE()]} 
                                        errorText="Vui lòng nhập tên tài khoản!" 
                                        onInput={inputHandler} />
                                    
                                </div>
                            </div>
                           
                            <div className={cx("button--container")}>                         
                            <Button className={cx("button--login")} disabled={!formState.isValid} >
                                <div className={cx("button--text")}>
                                    Gửi liên kết lấy lại mật khẩu
                                </div>
                            </Button>
                            </div>
                            <div className={cx("button--container")}>                                                                       
                                        <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>                                           
                                            <div className={cx("or--text")}>HOẶC</div>
                                        </div>
                                    
                                </div>
                        </div>
                        <Button className={cx("forgot--link")} href="/accounts/signup/" role="link" tabIndex="0">
                            <span className={cx("forgot--text")} dir="auto">Tạo tài khoản mới!</span>
                        </Button>
                    </form>
                </div>
            </Card>
            <Card className={cx("center-screen")}>
                <span className={cx("signup--container")} dir="auto">                   
                    <Button className={cx("forgot--link")} href="/accounts/login/" role="link" tabIndex="0">
                        <span className={cx("forgot--text")} dir="auto">Quay về trang đăng nhập</span>
                    </Button>                   
                </span>
            </Card>
        </div>
    </div>
};

export default ForgotPasswordPage;