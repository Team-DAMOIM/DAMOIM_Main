import React, {useContext, useState} from 'react';
import SingleComment from "./SingleComment";
import {addDoc, documentId, getDocs, query, Timestamp, where} from "firebase/firestore";
import {AuthContext} from "../../context/AuthContext";
import {Button, Input} from "antd";
import ReplyComment from "./ReplyComment";
import Alert from "@mui/material/Alert";
import {Snackbar} from "@mui/material";
import useUserUID from "../../hooks/useUserUID";
import {commentsCollectionRef} from "../../firestoreRef/ref";
import {SingleCommentTypes} from "../../utils/types";

const {TextArea} = Input;

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
        if (user) {
            const variables = {
                content: Comment,
                writerUID: user.uid,
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
    }


    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setComment(event.currentTarget.value)
    }

    return (
        <div>
            <Snackbar open={success} autoHideDuration={2000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                      onClose={() => {
                          setSuccess(false);
                      }}>
                <Alert severity="success" sx={{width: '100%'}}>
                    댓글 작성 성공했습니다!
                </Alert>
            </Snackbar>
            <br/>
            <p> 댓글 {commentLists?.length}개</p>
            <br/>
            <hr/>
            <br/>

            {commentLists?.map((comment: any, index: number) => (
                (!comment.responseTo &&
                    <React.Fragment key={index}>
                        <SingleComment comment={comment} postId={postId} refreshFunction={refreshFunction}/>
                        <ReplyComment commentLists={commentLists} postId={postId} parentCommentId={comment.id}
                                      refreshFunction={refreshFunction}/>

                    </React.Fragment>
                )
            ))}


            <form style={{display: 'flex'}} onSubmit={onSubmit}>
                <TextArea
                    style={{width: '100%', borderRadius: '5px'}}
                    onChange={handleChange}
                    value={Comment}
                    placeholder="댓글을 작성해주세요"
                />
                <br/>
                <Button style={{width: '20%', height: '52px'}} onClick={onSubmit}>Submit</Button>
            </form>

        </div>);
}

export default Comment;