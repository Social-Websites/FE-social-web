import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hook/auth-hook/auth-hook";
import { getUser } from "../../services/userService";
import { useEffect } from "react";
import usePrivateHttpClient from "../hook/http-hook/private-http-hook";

const RequireAuth = ({ admin = false }) => {
  const { auth, user, setUserLogin } = useAuth();
  const location = useLocation();
  const { isLoading, error, clearError, privateRequest } =
    usePrivateHttpClient();

  let userAuth;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(privateRequest);

        setUserLogin(response);

        userAuth = response;

        console.log("user: ", user);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchUser();
  }, [auth.accessToken]);

  if (admin && userAuth?.admin) {
    if (auth?.accessToken) return <Outlet />;
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  } else if (auth?.accessToken) {
    return <Outlet />;
  } else {
    return <Navigate to="/accounts/login" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
