import CommunityPage from "./pages/CommunityPage/CommunityPage";
import HomePage from "./pages/HomePage/HomePage";
import RankingPage from "./pages/RankingPage/RankingPage";
import JoinPartyPage from "./pages/JoinPartyPage/JoinPartyPage";
import AddCommunityPostPage from "./pages/AddCommunityPostPage/AddCommunityPostPage";
import CommunityDetailPage from "./pages/CommunityDetailPage/CommunityDetailPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Register from "./pages/RegisterPage/RegisterPage";
import PartyDetailPage from "./pages/PartyDetailPage/PartyDetailPage";
import CreatePartyPage from "./pages/CreatePartyPage/CreatePartyPage";
import UserPage from "./pages/UserPage/UserPage";


export default [
    {
        path: "/",
        component: HomePage
    },
    {
        path: "/rank",
        component: RankingPage
    },
    {
        path: "/create-party",
        component: CreatePartyPage,
        private: true
    },
    {
        path: "/join-party",
        component: JoinPartyPage
    },
    {
        path: "/community",
        component: CommunityPage
    },
    {
        path: "/partyDetail/:id",
        component: PartyDetailPage
    },
    {
        path: "/addCommunityPost",
        component: AddCommunityPostPage,
        private: true
    },
    {
        path: "/communityDetail/:id",
        component: CommunityDetailPage
    },
    {
        path: "/login",
        component: LoginPage
    },

    {
        path: "/register",
        component: Register
    },
    {
        path: "/userPage/:id",
        component: UserPage,
        private: true
    },

]