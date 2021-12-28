import React, {useContext, useEffect, useState} from 'react'
import {Comment, Avatar, Button, Input, Tooltip} from 'antd';

const {TextArea} = Input;
import Moment from 'react-moment';
import 'moment/locale/ko';
import "antd/dist/antd.css"
import {AuthContext} from "../../context/AuthContext";
import {addDoc, collection, getDocs, query, Timestamp, where} from "firebase/firestore";
import {db} from "../../firebase-config";
import firebase from "firebase/compat";
import Alert from "@mui/material/Alert";
import {Snackbar} from "@mui/material";


function SingleComment(props: any) {
    const user = useContext(AuthContext);

    const [commentValue, setCommentValue] = useState<string>("")
    const [OpenReply, setOpenReply] = useState<boolean>(false)
    const [userName, setUserName] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false)

    const usersCollectionRef = collection(db, "users")
    const commentsCollectionRef = collection(db, "comments");

    useEffect(() => {
        const getUser = async () => {
            if (user) {
                const userQuery = await query(usersCollectionRef, where("uid", "==", user.uid))
                const data = await getDocs(userQuery);
                setUserName(data.docs.map(doc => ({...doc.data()}))[0].name);
            }
        }
        getUser();
    }, [])

    const handleChange = (e: any) => {
        setCommentValue(e.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (user) {
            const variables = {
                postId: props.postId,
                responseTo: props.comment.id,
                writerUID: user.uid,
                writerName: userName,
                content: commentValue,
                createdAt: Timestamp.fromDate(new Date()),
            }
            const data = await addDoc(commentsCollectionRef, variables)
            const q = await query(commentsCollectionRef, where(firebase.firestore.FieldPath.documentId(), "==", data.id))
            const result = await getDocs(q);
            setCommentValue("");
            setSuccess(true)
            setOpenReply(!OpenReply);
            props.refreshFunction(result.docs.map(doc => ({...doc.data(), id: doc.id}))[0])
        }
    }

    const actions = [
        <span onClick={openReply} key="comment-basic-reply-to">답글</span>
    ]


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
            <Comment
                actions={actions}
                author={props.comment.writerName}
                avatar={
                    <Avatar
                        src="https://joeschmoe.io/api/v1/random"
                        alt="image"
                    />
                }
                content={
                    <p>
                        {props.comment.content}
                    </p>
                }
                datetime={
                    <span> <Moment fromNow>{props.comment.createdAt.toDate()}</Moment></span>
                }
            />


            {OpenReply &&
            <form style={{display: 'flex'}} onSubmit={onSubmit}>
                <TextArea
                    style={{width: '100%', borderRadius: '5px'}}
                    onChange={handleChange}
                    value={commentValue}
                    placeholder="댓글을 작성해주세요"
                />
                <br/>
                <Button style={{width: '20%', height: '52px'}} onClick={onSubmit}>Submit</Button>
            </form>
            }

        </div>
    )
}

export default SingleComment