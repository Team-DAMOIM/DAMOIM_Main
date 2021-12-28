import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

function ReplyComment(props:any) {
    const {commentLists , postId, parentCommentId , refreshFunction} = props;
    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)
    useEffect(() => {

        let commentNumber = 0;
        commentLists.map((comment:any,index:any) => {

            if (comment.responseTo === parentCommentId) {
                commentNumber++
            }
        })
        setChildCommentNumber(commentNumber)
    }, [commentLists])


    let renderReplyComment = (parentCommentId:any) =>
        commentLists.map((comment:any, index:any) => (
            <React.Fragment>
                {comment.responseTo === parentCommentId &&
                <div style={{ width: '80%', marginLeft: '40px' }}>
                    <SingleComment comment={comment} postId={postId} refreshFunction={refreshFunction} />
                    <ReplyComment commentLists={commentLists} parentCommentId={comment.id} postId={postId} refreshFunction={refreshFunction} />
                </div>
                }
            </React.Fragment>
        ))

    const handleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }


    return (
        <div>

            {ChildCommentNumber > 0 &&
            <p style={{ fontSize: '14px', margin: 0, color: 'gray' , display:'flex' ,cursor:'pointer' }}
               onClick={handleChange} >
                {OpenReplyComments ? <ArrowRightIcon/> :<ArrowDropDownIcon/>} 답글 {ChildCommentNumber}개 보기
            </p>
            }

            {OpenReplyComments &&
            renderReplyComment(parentCommentId)
            }

        </div>
    )
}

export default ReplyComment