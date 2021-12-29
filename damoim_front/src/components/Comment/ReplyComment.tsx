import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {SingleCommentTypes} from "../../utils/types";
import {ReplyCommentContainer, ReplyGuideContainer} from "./commentStyles";


interface ReplyCommentTypes {
    commentLists : SingleCommentTypes[];
    postId:string;
    parentCommentId:string;
    refreshFunction:(newComment: SingleCommentTypes) => void;
}

function ReplyComment({commentLists , postId, parentCommentId , refreshFunction}:ReplyCommentTypes) {
    const [ChildCommentNumber, setChildCommentNumber] = useState<number>(0)
    const [OpenReplyComments, setOpenReplyComments] = useState<boolean>(false)
    useEffect(() => {

        let commentNumber = 0;
        commentLists.map((comment:SingleCommentTypes) => {
            if (comment.responseTo === parentCommentId) {
                commentNumber++
            }
        })
        setChildCommentNumber(commentNumber)
    }, [commentLists])


    let renderReplyComment = (parentCommentId:string) =>
        commentLists.map((comment:SingleCommentTypes) => (
            <React.Fragment key={comment.id}>
                {comment.responseTo === parentCommentId &&
                <ReplyCommentContainer>
                    <SingleComment comment={comment} postId={postId} refreshFunction={refreshFunction} />
                    <ReplyComment commentLists={commentLists} parentCommentId={comment.id} postId={postId} refreshFunction={refreshFunction} />
                </ReplyCommentContainer>
                }
            </React.Fragment>
        ))

    const handleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }


    return (
        <div>

            {ChildCommentNumber > 0 &&
            <ReplyGuideContainer
               onClick={handleChange} >
                {
                    OpenReplyComments ?
                    <> <ArrowRightIcon/> 답글 {ChildCommentNumber}개 숨기기 </> :
                    <><ArrowDropDownIcon/> 답글 {ChildCommentNumber}개 보기</>
                }
            </ReplyGuideContainer>
            }
            {
                OpenReplyComments &&
                renderReplyComment(parentCommentId)
            }

        </div>
    )
}

export default ReplyComment