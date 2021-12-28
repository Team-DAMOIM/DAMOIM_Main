import CommunityPage from "./pages/CommunityPage/CommunityPage";
import HomePage from "./pages/HomePage/HomePage";
import RankingPage from "./pages/RankingPage/RankingPage";
import AddCommunityPostPage from "./pages/AddCommunityPostPage/AddCommunityPostPage";
import CommunityDetailPage from "./pages/CommunityDetailPage/CommunityDetailPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Register from "./pages/RegisterPage/RegisterPage";


export default [
    {
        path: "/",
        component: HomePage,
    },
    {
        path: "/community",
        component: CommunityPage,
    },
    {
        path: "/rank",
        component: RankingPage,
    },
    {
        path: "/addCommunityPost",
        component: AddCommunityPostPage,
    },
    {
        path: "/communityDetail/:id",
        component: CommunityDetailPage,
    },
    {
        path: "/login",
        component: LoginPage,
    },

    {
        path: "/register",
        component: Register,
    },
]