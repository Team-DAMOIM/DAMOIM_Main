import React, {useEffect, useState} from 'react';
import {CommunityDetailPageContainer, UserWithDetailContainer} from "./communityDetailPageStyles";
import userProfile from '../../assets/images/dummy/userprofile.png'
import UserWithProfile from "../../components/UserWithProfile/UserWithProfile";
import CommunityPostDetail from "../../components/CommunityPostDetail/CommunityPostDetail";
import {CardActions, CardContent, IconButton, Typography} from "@mui/material";
import Card from '@mui/material/Card';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import GppBadIcon from '@mui/icons-material/GppBad';
import Comment from "../../components/Comment/Comment";
import { getDocs, query, Timestamp, where} from "firebase/firestore";
import firebase from "firebase/compat";
import {useParams} from "react-router-dom";
import {commentsCollectionRef, communityCollectionRef} from "../../firestoreRef/ref";
import {SingleCommentTypes} from "../../utils/types";

interface postTypes {
    id: string;
    classification: string;
    content: string;
    createdAt: Timestamp;
    loves: number;
    platform: string;
    title: string;
    views: number;
    writerName: string;
    writerUID: string
}

function CommunityDetailPage() {
    const {id} = useParams<{ id: string }>()

    const [commentLists, setCommentLists] = useState<SingleCommentTypes[] | undefined>()
    const [post, setPost] = useState<postTypes | undefined>()

    useEffect(() => {
        const getCommentList = async () => {
            const q = await query(commentsCollectionRef, where("postId", "==", id))
            const data = await getDocs(q);
            setCommentLists(data.docs.map(doc => ({...doc.data(), id: doc.id})) as SingleCommentTypes[])
        }
        getCommentList()
    }, [])

    useEffect(() => {
        const getPost = async () => {
            const q = await query(communityCollectionRef, where(firebase.firestore.FieldPath.documentId(), "==", id))
            const data = await getDocs(q);
            setPost(data.docs.map(doc => ({...doc.data(), id: doc.id}))[0] as postTypes)
        }
        getPost()
    }, [])

    const updateComment = (newComment: SingleCommentTypes) => {
        if (commentLists) {
            setCommentLists([...commentLists,newComment])
        }
    }

    return (
        <CommunityDetailPageContainer>
            {post &&  <><span>{post.platform}</span> {post.classification}
                <h2>{post.title }</h2>
                <UserWithDetailContainer>
                    <UserWithProfile img={userProfile} userName={post.writerName}/>
                    <CommunityPostDetail views={post.views} loves={post.loves} comments={commentLists ? commentLists.length :0}
                                         date={post.createdAt.toDate().toString().substring(0, 24)}/>
                </UserWithDetailContainer>
                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary">
                            {
                                post.content
                            }
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites">
                            <FavoriteIcon/>
                        </IconButton>
                        <IconButton aria-label="share">
                            <ShareIcon/>
                        </IconButton>
                        <IconButton aria-label="">
                            <GppBadIcon/>
                        </IconButton>
                    </CardActions>
                </Card>
                <Comment postId={post.id} commentLists={commentLists}
                         refreshFunction={updateComment}/>
            </>}
        </CommunityDetailPageContainer>
    );
}

export default CommunityDetailPage;