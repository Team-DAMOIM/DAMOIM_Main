import React, {useContext, useState} from 'react';
import SingleComment from "./SingleComment";
import {addDoc, documentId, getDocs, query, Timestamp, where} from "firebase/firestore";
import {AuthContext} from "../../context/AuthContext";
import ReplyComment from "./ReplyComment";
import useUserUID from "../../hooks/useUserUID";
import {commentsCollectionRef} from "../../firestoreRef/ref";
import {SingleCommentTypes} from "../../utils/types";
import CommentAreaWithButton from "./CommentAreaWithButton";
import TopCenterSnackBar from "../TopCenterSnackBar";


interface CommentTypes {
    commentLists: SingleCommentTypes[] | undefined;
    postId: string;
    refreshFunction : (newComment: SingleCommentTypes) => void;
}

function Comment({commentLists, postId, refreshFunction}: CommentTypes) {
    const user = useContext(AuthContext);
    const [Comment, setComment] = useState<string>("")
    const [success, setSuccess] = useState<boolean>(false)


    const userName = useUserUID(user);

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
            const variables = {
                content: Comment,
                writerUID: user?.uid,
                writerName: userName,
                postId: postId,
                createdAt: Timestamp.fromDate(new Date()),
            }
            const data = await addDoc(commentsCollectionRef, variables)
            const q = await query(commentsCollectionRef, where(documentId(), "==", data.id))
            const result = await getDocs(q);

            setComment("")
            setSuccess(true)
            refreshFunction(result.docs.map(doc => ({...doc.data(), id: doc.id}))[0] as SingleCommentTypes)
    }


    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setComment(event.currentTarget.value)
    }

    return (
        <div>
            <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"} content={"댓글 작성 성공했습니다 !"}/>
            <br/>
            <p> 댓글 {commentLists?.length}개</p>
            <br/>
            <hr/>
            <br/>

            {commentLists?.map((comment: SingleCommentTypes) => (
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
        </div>)
        ;
}

export default Comment;