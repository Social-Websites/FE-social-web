import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useRefreshToken from "../../shared/hook/http-hook/refresh-token";
import useAuth from "../../shared/hook/auth-hook/auth-hook";

const PersistLogin = () => {
  const { isLoading, auth, persist, refresh } = useRefreshToken();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      }
    };

    if (!auth.accessToken) {
      verifyRefreshToken();
    }
  }, [isLoading]);

  useEffect(() => {
    console.log(`loading: ${isLoading}`);
    console.log(`aT: ${auth.accessToken}`);
  }, [isLoading]);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
};

export default PersistLogin;
