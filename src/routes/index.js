import HomePage from "../pages/HomePage";
import Profile from "../pages/Profile";
import Chat from "../pages/ChatPage";
import GroupPage from "../pages/GroupPage";
import LoginPage from "../components/Auth/LoginPage";
import SignUpPage from "../components/Auth/SignUpPage";
import ForgotPasswordPage from "../components/Auth/ForgotPasswordPage";
import AdminPage from "../pages/AdminPage/AdminPage";

import AuthPage from "../pages/AuthPage";
import DashboardBody from "../components/Admin/AdminBody/Dashboard/Dashboard";
import UsersManage from "../components/Admin/AdminBody/UsersManager/Users";
import PostsManage from "../components/Admin/AdminBody/PostsManager/Posts";
// public Routes
const publicRoutes = [
  {
    path: "/accounts/*",
    layout: AuthPage,
    components: [
      { path: "login", component: LoginPage },
      { path: "signup", component: SignUpPage },
      { path: "password/reset", component: ForgotPasswordPage },
    ],
  },

  {
    path: "/administrator/*",
    layout: AdminPage,
    components: [
      { path: "dashboard", component: DashboardBody },
      { path: "users", component: UsersManage },
      { path: "posts", component: PostsManage },
    ],
  },
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
