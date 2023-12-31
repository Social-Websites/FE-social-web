import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hook/auth-hook/auth-hook";
import { getUser } from "../../services/userService";
import { useEffect, useRef } from "react";
import usePrivateHttpClient from "../hook/http-hook/private-http-hook";

const RequireAuth = ({ admin = false }) => {
  const { auth,  setUserLogin } = useAuth();
  const location = useLocation();
  const { privateRequest } =
    usePrivateHttpClient();

  const effectRan = useRef(false);

  let userAuth;

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const fetchUser = async () => {
        try {
          const response = await getUser(privateRequest);

          setUserLogin(response);

          userAuth = response;

          //console.log("user: ", userAuth);
        } catch (err) {
          console.log(err.message);
        }
      };
      if (auth?.accessToken) fetchUser();
    }

    return () => {
      effectRan.current = true;
    };
  }, [auth.accessToken]);

  if (admin && auth?.accessToken) {
    if (auth?.admin) return <Outlet />;
    else
      return (
        <Navigate to="/error/unauthorized" state={{ from: location }} replace />
      );
  } else if (auth?.accessToken) {
    return <Outlet />;
  } else {
    return <Navigate to="/accounts/login" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
