import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hook/auth-hook";

const RequireAuth = ({ admin = false }) => {
  const { auth, user } = useAuth();
  const location = useLocation();

  console.log(user);

  if (admin && user?.admin) {
    if (auth) return <Outlet />;
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  } else if (auth) {
    return <Outlet />;
  } else {
    return <Navigate to="/accounts/login" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
