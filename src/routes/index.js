import HomePage from '../pages/HomePage';
import Profile from '../pages/Profile';
import LoginPage from '../pages/AuthPage/LoginPage';
import SignUpPage from '../pages/AuthPage/SignUpPage';
// public Routes
const publicRoutes = [
    { path: '/', component: HomePage },
    { path: '/profile', component: Profile },
    { path: '/accounts/login', component: LoginPage },
    { path: '/accounts/signup', component: SignUpPage },
]
// Private Routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };