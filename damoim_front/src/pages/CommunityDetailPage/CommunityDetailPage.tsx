import React, {useState} from 'react';
import {CommunityDetailPageContainer, UserWithDetailContainer} from "./CommunityDetailPageStyles";
import userProfile from '../../assets/images/dummy/userprofile.png'
import UserWithProfile from "../../components/UserWithProfile/UserWithProfile";
import CommunityPostDetail from "../../components/CommunityPostDetail/CommunityPostDetail";
import {CardActions, CardContent, IconButton, Typography} from "@mui/material";
import Card from '@mui/material/Card';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import GppBadIcon from '@mui/icons-material/GppBad';
import Comment from "../../components/Comment/Comment";
function CommunityDetailPage(props: any) {

    const [commentLists,setCommentLists] = useState<any>([])

    return (
        <CommunityDetailPageContainer>
            <span>넷플릭스</span> 잡담
            <h2>넷플릭스 왓챠보다 싸다!!!!!!!!!!!!!!</h2>
            <UserWithDetailContainer>
                <UserWithProfile img={userProfile} userName={"신짱구"}/>
                <CommunityPostDetail views={12321} loves={23} comments={17} date={"2021-12-28 01:40:22"}/>
            </UserWithDetailContainer>
            <Card >
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        This impressive paella is a perfect party dish and a fun meal to cook
                        together with your guests. Add 1 cup of frozen peas along with the mussels,
                        if you like.
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    <IconButton aria-label="">
                        <GppBadIcon />
                    </IconButton>
                </CardActions>
            </Card>
            <Comment postId={213213} setCommentLists={setCommentLists}/>
        </CommunityDetailPageContainer>
    );
}

export default CommunityDetailPage;