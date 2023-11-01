import React, { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./HomePage.scss";
import Sidenav from "../../shared/components/NavBar";
import Timeline from "../../components/TimeLine";
import useLogout from "../../shared/hook/auth-hook/logout-hook";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/userService";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";

const cx = classNames.bind(styles);

function HomePage() {
  const navigate = useNavigate();
  const { logout } = useLogout();

  const { auth, user, setUserLogin } = useAuth();
  const { isLoading, error, clearError, privateRequest } =
    usePrivateHttpClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(privateRequest);
        setUserLogin(response);

        console.log(user);
      } catch (err) {
        console.log(err.message);
      }
    };
    console.log(auth?.accessToken);
    fetchUser();
  }, [auth.accessToken]);
  const signOut = async () => {
    await logout();

    navigate("/accounts/login");
  };

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
