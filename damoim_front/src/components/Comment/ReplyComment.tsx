import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';

function ReplyComment(props:any) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)
    useEffect(() => {

        let commentNumber = 0;
        props.commentLists.map((comment:any,index:any) => {

            if (comment.responseTo === props.parentCommentId) {
                commentNumber++
            }
        })
        setChildCommentNumber(commentNumber)
    }, [props.commentLists])


    let renderReplyComment = (parentCommentId:any) =>
        props.commentLists.map((comment:any, index:any) => (
            <React.Fragment>
                {comment.responseTo === parentCommentId &&
                <div style={{ width: '80%', marginLeft: '40px' }}>
                    <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                    <ReplyComment CommentLists={props.commentLists} parentCommentId={comment._id} postId={props.postId} refreshFunction={props.refreshFunction} />
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
            <p style={{ fontSize: '14px', margin: 0, color: 'gray' }}
               onClick={handleChange} >
                View {ChildCommentNumber} more comment(s)
            </p>
            }

            {OpenReplyComments &&
            renderReplyComment(props.parentCommentId)
            }

        </div>
    )
}

export default ReplyComment