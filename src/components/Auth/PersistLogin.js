import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useRefreshToken from "../../shared/hook/http-hook/refresh-token";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import WelcomPage from "../../pages/AuthPage/WelcomPage";

const PersistLogin = () => {
  const [isLoad, setIsLoad] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoad(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoad(false);
  }, []);

  useEffect(() => {
    console.log(`loading: ${isLoad}`);
    console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoad]);

  return <>{!persist ? <Outlet /> : isLoad ? <WelcomPage /> : <Outlet />}</>;
};

export default PersistLogin;
