import CommunityPage from "./pages/CommunityPage/CommunityPage";
import HomePage from "./pages/HomePage/HomePage";
import RankingPage from "./pages/RankingPage/RankingPage";
import AddCommunityPostPage from "./pages/AddCommunityPostPage/AddCommunityPostPage";


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
]