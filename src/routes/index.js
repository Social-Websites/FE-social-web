import HomePage from '../pages/HomePage';
import Profile from '../pages/Profile';
// public Routes
const publicRoutes = [
    { path: '/', component: HomePage },
    { path: '/profile', component: Profile },
    //{ path: '/accounts/login', component: Profile },
]
// Private Routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };