import React, {ChangeEvent, FormEvent, useContext, useState} from 'react'
import {Comment, Avatar} from 'antd';
import Moment from 'react-moment';
import 'moment/locale/ko';
import {addDoc, documentId, getDocs, query, Timestamp, where} from "firebase/firestore";
import {AuthContext} from "../../context/AuthContext";
import useUserUID from "../../hooks/useUserUID";
import {commentsCollectionRef, usersCollectionRef} from "../../firestoreRef/ref";
import { SingleCommentTypesWithUser, userInfoTypes} from "../../utils/types";
import CommentAreaWithButton from "./CommentAreaWithButton";
import {AntdCommentContainer} from "./commentStyles";
import LikeDislikes from "../LikeDislikes/LikeDislikes";
import TopCenterSnackBar from "../TopCenterSnackBar/TopCenterSnackBar";

interface SingleCommentComponentTypes {
    comment: SingleCommentTypesWithUser;
    postId: string;
    refreshFunction: (newComment: SingleCommentTypesWithUser) => void;
}

function SingleComment({comment, postId, refreshFunction}: SingleCommentComponentTypes) {
    const user = useContext(AuthContext);

    const [commentValue, setCommentValue] = useState<string>("")
    const [OpenReply, setOpenReply] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [userNotFound,setUserNotFound] = useState<boolean>(false)


    const userInfo = useUserUID(user)

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCommentValue(e.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if(!user){
            setUserNotFound(true);
            return
        }
        const variables = {
            postId: postId,
            responseTo: comment.id,
            writerUID: user?.uid,
            writerName: userInfo?.name,
            content: commentValue,
            createdAt: Timestamp.fromDate(new Date()),
        }
        const data = await addDoc(commentsCollectionRef, variables)
        const q = await query(commentsCollectionRef, where(documentId(), "==", data.id))
        const result = await getDocs(q);
        const tempResult = result.docs.map(doc => ({...doc.data(), id: doc.id}))[0] as SingleCommentTypesWithUser;
        const getUserQuery = await query(usersCollectionRef,where(documentId(),"==",tempResult.writerUID));
        const userResult = await getDocs(getUserQuery);
        const userInformation = userResult.docs.map(doc => (doc.data()))[0] as userInfoTypes
        refreshFunction({...tempResult,nickName:userInformation.nickName,avatar:userInformation.avatar,name:userInformation.name})
        setCommentValue("");
        setSuccess(true)
        setOpenReply(!OpenReply);
    }

    const actions = [
        <LikeDislikes comment commentId={comment.id}/>,
        <span onClick={openReply} key="comment-basic-reply-to">답글</span>
    ]


    return (
        <div>

            <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"} content={"댓글 작성 성공했습니다 !"}/>

            <AntdCommentContainer>
                <Comment
                    actions={actions}
                    author={<a>{comment.nickName}</a>}
                    avatar={
                        <Avatar
                            src={comment.avatar || "/images/personIcon.png"}
                            alt="image"
                        />
                    }
                    content={
                        <p>
                            {comment.content}
                        </p>
                    }
                    datetime={
                        <span> <Moment fromNow>{comment.createdAt.toDate()}</Moment></span>
                    }
                />
            </AntdCommentContainer>
            {OpenReply &&
            <CommentAreaWithButton onSubmit={onSubmit} handleChange={handleChange}
                                   commentValue={commentValue}
            />

            }
            <TopCenterSnackBar value={userNotFound} setValue={setUserNotFound} severity={"error"} content={"로그인 후 다시 이용해주세요 !"}/>

        </div>
    )
}

export default SingleComment