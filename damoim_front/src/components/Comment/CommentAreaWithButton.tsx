import React, {ChangeEvent, FormEvent} from 'react';
import {Button, Input} from "antd";
import {CommentForm} from "./commentStyles";
const {TextArea} = Input;

interface CommentAreaWithButtonTypes {
    onSubmit:(event : FormEvent) => void;
    handleChange : (event:ChangeEvent<HTMLTextAreaElement>) => void;
    commentValue:string;
}

function CommentAreaWithButton({onSubmit,handleChange,commentValue}:CommentAreaWithButtonTypes) {
    return (
        <CommentForm onSubmit={onSubmit}>
            <TextArea
                onChange={handleChange}
                value={commentValue}
                placeholder="댓글을 작성해주세요"
            />
            <br/>
            <Button  onClick={onSubmit}>댓글</Button>
        </CommentForm>
    );
}

export default CommentAreaWithButton;