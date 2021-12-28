import React, { useState } from 'react'
function SingleComment(props:any) {
    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false)

    const handleChange = (e:any) => {
        setCommentValue(e.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    const onSubmit = (e:any) => {
        e.preventDefault();

        const variables = {
            postId: props.postId,
            responseTo: props.comment._id,
            content: CommentValue
        }


    }

    // const actions = [
    //     <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id}/>,
    //     <span onClick={openReply} key="comment-basic-reply-to">Reply to </span>
    // ]

    return (
        <div>
            {/*<Comment*/}
            {/*    actions={actions}*/}
            {/*    author={props.comment.writer.name}*/}
            {/*    avatar={*/}
            {/*        <Avatar*/}
            {/*            src={props.comment.writer.image}*/}
            {/*            alt="image"*/}
            {/*        />*/}
            {/*    }*/}
            {/*    content={*/}
            {/*        <p>*/}
            {/*            {props.comment.content}*/}
            {/*        </p>*/}
            {/*    }*/}
            {/*></Comment>*/}


            {/*{OpenReply &&*/}
            {/*<form style={{ display: 'flex' }} onSubmit={onSubmit}>*/}
            {/*    <TextArea*/}
            {/*        style={{ width: '100%', borderRadius: '5px' }}*/}
            {/*        onChange={handleChange}*/}
            {/*        value={CommentValue}*/}
            {/*        placeholder="write some comments"*/}
            {/*    />*/}
            {/*    <br />*/}
            {/*    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>*/}
            {/*</form>*/}
            {/*}*/}

        </div>
    )
}

export default SingleComment