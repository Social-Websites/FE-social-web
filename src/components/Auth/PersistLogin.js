import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useRefreshToken from "../../shared/hook/http-hook/refresh-token";
import useAuth from "../../shared/hook/auth-hook/auth-hook";

const PersistLogin = () => {
  const { isLoading, refresh } = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    if (!auth) verifyRefreshToken();
  }, []);

  useEffect(() => {
    console.log(`loading: ${isLoading}`);
    console.log(`aT: ${JSON.stringify(auth)}`);
  }, [isLoading]);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
};

export default PersistLogin;
