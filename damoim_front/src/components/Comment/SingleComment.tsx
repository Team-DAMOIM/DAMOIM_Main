import React, {ChangeEvent, FormEvent, useContext, useState} from 'react'
import {Comment, Avatar} from 'antd';
import Moment from 'react-moment';
import 'moment/locale/ko';
import {addDoc, documentId, getDocs, query, Timestamp, where} from "firebase/firestore";
import {AuthContext} from "../../context/AuthContext";
import useUserUID from "../../hooks/useUserUID";
import {commentsCollectionRef} from "../../firestoreRef/ref";
import {SingleCommentTypes} from "../../utils/types";
import CommentAreaWithButton from "./CommentAreaWithButton";
import {AntdCommentContainer} from "./commentStyles";
import LikeDislikes from "../LikeDislikes/LikeDislikes";
import TopCenterSnackBar from "../TopCenterSnackBar/TopCenterSnackBar";

interface SingleCommentComponentTypes {
    comment: SingleCommentTypes;
    postId: string;
    refreshFunction: (newComment: SingleCommentTypes) => void;
}

function SingleComment({comment, postId, refreshFunction}: SingleCommentComponentTypes) {
    const user = useContext(AuthContext);

    const [commentValue, setCommentValue] = useState<string>("")
    const [OpenReply, setOpenReply] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)


    const userInfo = useUserUID(user)

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCommentValue(e.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
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
        setCommentValue("");
        setSuccess(true)
        setOpenReply(!OpenReply);
        refreshFunction(result.docs.map(doc => ({...doc.data(), id: doc.id}))[0] as SingleCommentTypes)
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
                    author={<a>{comment.writerName}</a>}
                    avatar={
                        <Avatar
                            src="https://joeschmoe.io/api/v1/random"
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

        </div>
    )
}

export default SingleComment