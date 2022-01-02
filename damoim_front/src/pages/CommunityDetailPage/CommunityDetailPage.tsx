import React, {useContext, useEffect, useState} from 'react';
import {
    CommunityDetailPageContainer,
    CommunityDetailPageIconContainer,
    UserWithDetailContainer
} from "./communityDetailPageStyles";
import UserWithProfile from "../../components/UserWithProfile/UserWithProfile";
import CommunityPostDetail from "../../components/CommunityPostDetail/CommunityPostDetail";
import {CardActions, CardContent, IconButton, Typography} from "@mui/material";
import Card from '@mui/material/Card';
import ShareIcon from '@mui/icons-material/Share';
import GppBadIcon from '@mui/icons-material/GppBad';
import Comment from "../../components/Comment/Comment";
import {getDocs, query, where, documentId, doc, updateDoc, orderBy} from "firebase/firestore";
import {useParams} from "react-router-dom";
import {
    commentsCollectionRef,
    communityCollectionRef, disLikesCollectionRef, likesCollectionRef,
    usersCollectionRef
} from "../../firestoreRef/ref";
import {postTypes, SingleCommentTypes, SingleCommentTypesWithUser, userInfoTypes} from "../../utils/types";
import {Tag} from "antd";
import LikeDislikes from "../../components/LikeDislikes/LikeDislikes";
import {db} from "../../firebase-config";
import {useScript} from "../../hooks/useScript";
import ReportForm from "../../components/ReportForm/ReportForm";


declare global {
    interface Window {
        Kakao: any;
    }
}


function CommunityDetailPage() {
    const {id} = useParams<{ id: string }>()
    const [commentLists, setCommentLists] = useState<SingleCommentTypesWithUser[] | undefined>()
    const [post, setPost] = useState<postTypes | undefined>()
    const [reportOpen,setReportOpen] = useState<boolean>(false);
    const [writerInfo,setWriterInfo] = useState<userInfoTypes>();


    useEffect(() => {
        const getCommentList = async () => {
            const q = await query(commentsCollectionRef, where("postId", "==", id),orderBy("createdAt",'desc'))
            const data = await getDocs(q);

            const tempComments = data.docs.map(doc => ({...doc.data(), id: doc.id})) as SingleCommentTypesWithUser[]
            let tempCommentsWithUser:SingleCommentTypesWithUser[] = []
            tempComments.map(async (comment) => {
                const getUserQuery = await query(usersCollectionRef,where(documentId(),"==",comment.writerUID))
                const user = await getDocs(getUserQuery);
                const userInformation = user.docs.map(doc => (doc.data()))[0] as userInfoTypes
                tempCommentsWithUser.push({
                    ...comment, nickName:userInformation.nickName,avatar:userInformation.avatar,name:userInformation.name
                })
                if(tempComments.length === tempCommentsWithUser.length){
                    setCommentLists(tempCommentsWithUser)
                }
            })
        }
        getCommentList()
    }, [])

    useEffect(() => {
        const getPost = async () => {
            const q = await query(communityCollectionRef, where(documentId(), "==", id))
            const data = await getDocs(q);
            const tempPost = data.docs.map(doc => ({...doc.data(), id: doc.id}))[0] as postTypes
            setPost(tempPost)
            const communityDoc = doc(db, "communityPosts", tempPost.id);
            await updateDoc(communityDoc, {
                views: tempPost.views + 1
            })

            const userQuery = await query(usersCollectionRef, where("uid", "==", tempPost.writerUID))
            const userData = await getDocs(userQuery);
            setWriterInfo(userData.docs.map(doc => ({...doc.data()}))[0] as userInfoTypes);
        }
        getPost()
    }, [])





    const updateComment = (newComment: SingleCommentTypesWithUser) => {
        if (commentLists) {
            setCommentLists([...commentLists, newComment])
        }
    }

    const status = useScript("https://developers.kakao.com/sdk/js/kakao.js");
    // kakao sdk 초기화하기
    // status가 변경될 때마다 실행되며, status가 ready일 때 초기화를 시도합니다.
    useEffect(() => {
        if (status === "ready" && window.Kakao) {
            // 중복 initialization 방지
            if (!window.Kakao.isInitialized()) {
                // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
                window.Kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);
            }
        }
    }, [status]);

    const handleKakaoButton = () => {
        window.Kakao.Link.sendScrap({
            requestUrl: "http://localhost:3000/communityDetail/p0oZJZwRDBwYQLuZ2Rbc",
        });
    };







    return (
        <CommunityDetailPageContainer>
            {post && <> <Tag color="geekblue">{post.platform}</Tag> <Tag color="blue">{post.classification}</Tag>
                <h2>{post.title}</h2>
                <UserWithDetailContainer>
                    <UserWithProfile img={writerInfo?.avatar || "/images/personIcon.png"} userName={writerInfo?.nickName as string || writerInfo?.name as string}/>
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
                            <IconButton aria-label="share" onClick={handleKakaoButton}>
                                <ShareIcon />
                            </IconButton>
                            <IconButton aria-label="" onClick={()=>{setReportOpen(true)}}>
                                <GppBadIcon/>
                            </IconButton>
                        </CommunityDetailPageIconContainer>
                    </CardActions>
                </Card>
                <Comment postId={post.id} commentLists={commentLists}
                         refreshFunction={updateComment}/>

                <ReportForm reportOpen={reportOpen} setReportOpen={setReportOpen} postId={id} />

            </>}
        </CommunityDetailPageContainer>
    );
}

export default CommunityDetailPage;