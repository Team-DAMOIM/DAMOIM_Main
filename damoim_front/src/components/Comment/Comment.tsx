import React, {ChangeEvent, useState} from 'react';
import {Button, TextField} from "@mui/material";

function Comment(props: any) {
    const [comment, setComment] = useState<string>("")

    const onSubmit = (event : React.FormEvent) => {
        event.preventDefault();

        const variables = {
            content:Comment,
            writer:"개복치",
            postId: props.postId
        }

        props.setCommentLists()
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.currentTarget.value)
    }
    return (
        <div>
            <br/>
            <p> 댓글 </p>
            <br/>
            <hr/>
            <br/>

            <form style={{display: "flex"}} onSubmit={onSubmit}>
                <TextField
                    id="outlined-multiline-static"
                    label="댓글"
                    placeholder="댓글 작성해주세요"
                    multiline
                    rows={1}
                    fullWidth
                    onChange={handleChange}
                    value={comment}
                    name="content"
                />
                <br/>
                <Button variant="contained" style={{width: '20%', height: '52px' ,marginLeft:'10px'}} onClick={onSubmit}>댓글작성</Button>
            </form>


        </div>);
}

export default Comment;