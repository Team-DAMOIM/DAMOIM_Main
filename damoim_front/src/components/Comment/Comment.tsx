import React, {useContext, useState} from 'react';
import SingleComment from "./SingleComment";
import {addDoc, documentId, getDocs, query, Timestamp, where} from "firebase/firestore";
import {AuthContext} from "../../context/AuthContext";
import ReplyComment from "./ReplyComment";
import useUserUID from "../../hooks/useUserUID";
import {commentsCollectionRef, usersCollectionRef} from "../../firestoreRef/ref";
import {SingleCommentTypes, SingleCommentTypesWithUser, userInfoTypes} from "../../utils/types";
import CommentAreaWithButton from "./CommentAreaWithButton";
import TopCenterSnackBar from "../TopCenterSnackBar/TopCenterSnackBar";


interface CommentTypes {
    commentLists: SingleCommentTypesWithUser[] | undefined;
    postId: string;
    refreshFunction: (newComment: SingleCommentTypesWithUser) => void;
}

function Comment({commentLists, postId, refreshFunction}: CommentTypes) {
    const user = useContext(AuthContext);
    const [userNotFound,setUserNotFound] = useState<boolean>(false)
    const [Comment, setComment] = useState<string>("")
    const [success, setSuccess] = useState<boolean>(false)


    const userInfo = useUserUID(user);

    const onSubmit = async (event: React.FormEvent) => {
        if(!user){
            setUserNotFound(true);
            return;
        }
        event.preventDefault();
        const variables = {
            content: Comment,
            writerUID: user?.uid,
            writerName: userInfo?.name,
            postId: postId,
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
        setComment("")
        setSuccess(true)
    }


    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setComment(event.currentTarget.value)
    }

    return (
        <div>
            <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"} content={"댓글 작성 성공했습니다 !"}/>
            <br/>
            <p> 댓글 {commentLists ? commentLists.length : '0'}개</p>
            <br/>
            <hr/>
            <br/>

            {commentLists?.map((comment: SingleCommentTypesWithUser) => (
                (!comment.responseTo &&
                    <React.Fragment key={comment.id}>
                        <SingleComment comment={comment} postId={postId} refreshFunction={refreshFunction}/>
                        <ReplyComment commentLists={commentLists} postId={postId} parentCommentId={comment.id}
                                      refreshFunction={refreshFunction}/>
                    </React.Fragment>
                )
            ))}

            <CommentAreaWithButton onSubmit={onSubmit} handleChange={handleChange}
                                   commentValue={Comment}
            />
            <TopCenterSnackBar value={userNotFound} setValue={setUserNotFound} severity={"error"} content={"로그인 후 다시 이용해주세요 !"}/>

        </div>)
        ;
}

export default Comment;