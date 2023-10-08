import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Auth.scss";
import Input from "../../shared/components/FormElement/Input";
import Card from "../../shared/components/UIElement/Card";
import { useForm } from "../../shared/hook/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Button from "../../shared/components/FormElement/Button";
const cx = classNames.bind(styles);



const LoginPage = () => {
    const [isUsernameClassAdd, setIsUsernameClassAdd] = useState(false);
    const [isPasswordClassAdd, setIsPasswordClassAdd] = useState(false);

    // const handleInputClass = (id, isValid) => {
    //     console.log(isValid);
    //     if(id === "username"){
    //         setIsUsernameClassAdd(isValid);
    //     }

    //     if(id === "password"){
    //         setIsPasswordClassAdd(isValid);
    //     }
    // }

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
                    <div aria-disabled="false" role="button" tabIndex={0} className={cx("cursor")}>
                        <i data-visualcompletion="css-img" class role="img" aria-label="Instagram" className={cx("logo--main")}></i>
                    </div>
                </div>
                <div className={cx("form--container")}>
                    <form className={cx("form--main")}>
                        <div className={cx("form--separate")}>
                            <div className={cx("input--margin")}>
                                <div className={cx("input--container")}>                                                                       
                                        <Input className={cx("input--user")}
                                        labelClass={cx("input--label", {"on-input": isUsernameClassAdd})}
                                        spanClass={cx("input--span")}
                                        element="input" 
                                        id="username" 
                                        type="text" 
                                        ariaLabel="Tên người dùng" 
                                        ariaRequired="true" 
                                        autocapitalize="off" 
                                        maxlength="75" 
                                        validators={[VALIDATOR_REQUIRE()]} 
                                        errorText="Vui lòng nhập tên tài khoản!" 
                                        onInput={inputHandler} />
                                    
                                </div>
                            </div>

                            <div className={cx("input--margin")}>
                                <div className={cx("input--container")}>                                                                       
                                        <Input className={cx("input--user")}
                                        labelClass={cx("input--label", {"on-input": isPasswordClassAdd})}
                                        spanClass={cx("input--span")}
                                        element="input" 
                                        id="password" 
                                        type="password" 
                                        ariaLabel="Mật khẩu" 
                                        ariaRequired="true" 
                                        autocapitalize="off" 
                                        maxlength="75" 
                                        validators={[VALIDATOR_REQUIRE()]} 
                                        errorText="Vui lòng nhập mật khẩu!" 
                                        onInput={inputHandler} />
                                </div>
                            </div>
                            <div className={cx("button--container")}>                         
                            <Button className={cx("button--login")} disabled={!formState.isValid} >
                                <div className={cx("button--text")}>
                                    Đăng nhập
                                </div>
                            </Button>
                            </div>
                        </div>
                        <Button className={cx("forgot--link")} href="/accounts/password/reset/" role="link" tabIndex="0">
                            <span className={cx("forgot--text")} dir="auto">Quên mật khẩu?</span>
                        </Button>
                    </form>
                </div>
            </Card>
            <Card className={cx("center-screen")}>
                <span className={cx("signup--container")} dir="auto">
                    <p className={cx("signup--question")}>Bạn chưa có tài khoản hả?&nbsp;
                        <Button href="/accounts/signup/" className={cx("signup--link")} role="link" tabIndex="0">
                            <span className={cx("signup--text")} dir="auto">Đăng ký</span>
                        </Button>
                    </p>
                </span>
            </Card>
        </div>
    </div>
};

export default LoginPage;