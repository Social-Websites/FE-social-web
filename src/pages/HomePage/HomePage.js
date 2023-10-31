import React, { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./HomePage.scss";
import Sidenav from "../../shared/components/NavBar";
import Timeline from "../../components/TimeLine";
import usePrivateHttpClient from "../../shared/hook/http-hook";
import { getUser } from "../../services/userService";
import useAuth from "../../shared/hook/auth-hook";

const cx = classNames.bind(styles);

function HomePage() {
  const { auth, getUserLogin } = useAuth();
  const { isPrivateLoading, privateError, clearPrivateError, privateRequest } =
    usePrivateHttpClient();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(privateRequest);
        console.log(user);
        getUserLogin(user);
      } catch (err) {
        console.log(err.message);
      }
    };
    if (auth) fetchUser();
  }, []);

  return (
    <div className={cx("homepage")}>
      <div className={cx("homepage__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("homepage__timeline")}>
        <Timeline style={{ width: "90%" }} />
      </div>
    </div>
  );
}

export default HomePage;
