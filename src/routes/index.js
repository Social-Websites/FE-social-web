import HomePage from "../pages/HomePage";
import Profile from "../pages/Profile";
import Chat from "../pages/ChatPage";
import GroupDetail from "../pages/GroupDetail";
import PostGroupDetail from "../pages/PostGroupDetail";
import GroupPage from "../pages/GroupPage";
import LoginPage from "../components/Auth/LoginPage";
import SignUpPage from "../components/Auth/SignUpPage";
import ForgotPasswordPage from "../components/Auth/ForgotPasswordPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import OtpForm from "../components/Auth/OtpForm";
import AuthPage from "../pages/AuthPage";
import DashboardBody from "../components/Admin/AdminBody/Dashboard/Dashboard";
import UsersManage from "../components/Admin/AdminBody/UsersManager/Users";
import PostsManage from "../components/Admin/AdminBody/PostsManager/Posts";
import ReportsManage from "../components/Admin/AdminBody/ReportsManager/Reports";
import Error404Page from "../pages/AuthPage/Error404Page";
import UnauthorizedPage from "../pages/AuthPage/UnauthorizedPage";
import ResetPasswordForm from "../components/Auth/ResetPasswordForm";
import EditProfilePage from "../pages/EditProfilePage";
import ChangePassPage from "../pages/ChangePassPage";
import PostDetailPage from "../pages/PostDetailPage";
import AdminLoginForm from "../components/Auth/AdminLoginForm";
// public Routes
const publicRoutes = [
  {
    path: "/error/*",
    layout: AuthPage,
    components: [
      { path: "unauthorized", component: UnauthorizedPage },
      { path: "404-error", component: Error404Page },
    ],
  },
  {
    path: "/accounts/*",
    layout: AuthPage,
    components: [
      { path: "login", component: LoginPage },
      { path: "admin/alogin", component: AdminLoginForm },
      { path: "signup", component: SignUpPage },
      { path: "password/reset", component: ForgotPasswordPage },
      { path: "otp", component: OtpForm },
      { path: "reset-password/:token", component: ResetPasswordForm },
    ],
  },
];
// Private Routes
const privateRoutes = [
  { path: "/", component: HomePage },
  { path: "/:username/*", component: Profile },
  { path: "/chat", component: Chat },
  { path: "/group", component: GroupPage },
  { path: "/g/:id/p/:pId", component: PostGroupDetail },
  { path: "/g/:id/*", component: GroupDetail },
  { path: "/user-info/edit", component: EditProfilePage },
  { path: "/accounts/changePass/", component: ChangePassPage },
  { path: "/p/:id", component: PostDetailPage },
];
// Private Routes
const adminRoutes = [
  {
    path: "/administrator/*",
    layout: AdminPage,
    components: [
      { path: "dashboard", component: DashboardBody },
      { path: "users", component: UsersManage },
      { path: "posts", component: PostsManage },
      { path: "reports", component: ReportsManage },
    ],
  },
];

export { publicRoutes, privateRoutes, adminRoutes };
