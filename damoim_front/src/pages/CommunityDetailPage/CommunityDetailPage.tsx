import React, {useContext, useEffect, useState} from 'react';
import {
    CommunityDetailPageContainer,
    CommunityDetailPageIconContainer,
    UserWithDetailContainer
} from "./communityDetailPageStyles";
import userProfile from '../../assets/images/dummy/userprofile.png'
import UserWithProfile from "../../components/UserWithProfile/UserWithProfile";
import CommunityPostDetail from "../../components/CommunityPostDetail/CommunityPostDetail";
import {CardActions, CardContent, IconButton, Typography} from "@mui/material";
import Card from '@mui/material/Card';
import ShareIcon from '@mui/icons-material/Share';
import GppBadIcon from '@mui/icons-material/GppBad';
import Comment from "../../components/Comment/Comment";
import {getDocs, query, where, documentId} from "firebase/firestore";
import {useParams} from "react-router-dom";
import {commentsCollectionRef, communityCollectionRef, likesCollectionRef} from "../../firestoreRef/ref";
import {postTypes, SingleCommentTypes} from "../../utils/types";
import {Tag} from "antd";
import LikeDislikes from "../../components/LikeDislikes/LikeDislikes";



function CommunityDetailPage() {
    const {id} = useParams<{ id: string }>()
    const [commentLists, setCommentLists] = useState<SingleCommentTypes[] | undefined>()
    const [post, setPost] = useState<postTypes | undefined>()
    const [loves,setLoves] = useState<number>(0)

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
            const q = await query(communityCollectionRef, where(documentId(), "==", id))
            const data = await getDocs(q);
            setPost(data.docs.map(doc => ({...doc.data(), id: doc.id}))[0] as postTypes)
        }
        getPost()
    }, [])

    // useEffect(()=>{
    //     const getLoves = async () => {
    //         const q = await query(likesCollectionRef,where("postId","==",id))
    //         const data = await getDocs(q);
    //         const loves = data.docs.map(doc => ({...doc.data(), id: doc.id})).length
    //         // setPost({...post,loves:3} as postTypes)
    //     }
    //     getLoves();
    // },[])

    const updateComment = (newComment: SingleCommentTypes) => {
        if (commentLists) {
            setCommentLists([...commentLists, newComment])
        }
    }

    return (
        <CommunityDetailPageContainer>
            {post && <> <Tag color="geekblue">{post.platform}</Tag> <Tag color="blue">{post.classification}</Tag>
                <h2>{post.title}</h2>
                <UserWithDetailContainer>
                    <UserWithProfile img={userProfile} userName={post.writerName}/>
                    <CommunityPostDetail views={post.views} loves={post.loves}
                                         comments={commentLists ? commentLists.length : 0}
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
                    <CardActions>
                        <LikeDislikes post postId={post.id}/>
                        <CommunityDetailPageIconContainer>
                            <IconButton aria-label="share">
                                <ShareIcon/>
                            </IconButton>
                            <IconButton aria-label="">
                                <GppBadIcon/>
                            </IconButton>
                        </CommunityDetailPageIconContainer>
                    </CardActions>
                </Card>
                <Comment postId={post.id} commentLists={commentLists}
                         refreshFunction={updateComment}/>
            </>}
        </CommunityDetailPageContainer>
    );
}

export default CommunityDetailPage;