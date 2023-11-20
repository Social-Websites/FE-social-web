import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useRefreshToken from "../../shared/hook/http-hook/refresh-token";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import WelcomPage from "../../pages/AuthPage/WelcomPage";

const PersistLogin = () => {
  const [isLoad, setIsLoad] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          await refresh();
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoad(false);
        }
      };

      !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoad(false);
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  // useEffect(() => {
  //   console.log(`loading: ${isLoad}`);
  //   console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  // }, [isLoad]);

  return <>{!persist ? <Outlet /> : isLoad ? <WelcomPage /> : <Outlet />}</>;
};

export default PersistLogin;
