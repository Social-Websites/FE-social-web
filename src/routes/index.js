import HomePage from "../pages/HomePage";
import Profile from "../pages/Profile";
import Chat from "../pages/ChatPage";
import GroupPage from "../pages/GroupPage";
import LoginPage from "../pages/AuthPage/LoginPage";
import SignUpPage from "../pages/AuthPage/SignUpPage";
import ForgotPasswordPage from "../pages/AuthPage/ForgotPasswordPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import GetUserPage from "../pages/AuthPage/GetUserPage";
// public Routes
const publicRoutes = [
  { path: "/accounts/login", component: LoginPage },
  { path: "/accounts/signup", component: SignUpPage },
  { path: "/accounts/password/reset", component: ForgotPasswordPage },
  { path: "/redirect", component: GetUserPage },
  { path: "/administrator/*", component: AdminPage },
];
// Private Routes
const privateRoutes = [
  { path: "/", component: HomePage },
  { path: "/profile", component: Profile },
  { path: "/chat", component: Chat },
  { path: "/group", component: GroupPage },
];
// Private Routes
const adminRoutes = [];

export { publicRoutes, privateRoutes, adminRoutes };
