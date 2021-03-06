import React, {ChangeEvent, FormEvent, useContext, useState} from 'react'
import {Comment, Avatar} from 'antd';
import Moment from 'react-moment';
import 'moment/locale/ko';
import {addDoc, deleteDoc, doc, documentId, getDocs, query, Timestamp, where} from "firebase/firestore";
import {AuthContext} from "../../context/AuthContext";
import useUserUID from "../../hooks/useUserUID";
import {commentsCollectionRef, usersCollectionRef} from "../../firestoreRef/ref";
import {SingleCommentTypesWithUser, userInfoTypes} from "../../utils/types";
import CommentAreaWithButton from "./CommentAreaWithButton";
import {AntdCommentContainer} from "./commentStyles";
import LikeDislikes from "../LikeDislikes/LikeDislikes";
import TopCenterSnackBar from "../TopCenterSnackBar/TopCenterSnackBar";
import {Link} from 'react-router-dom'
import {db} from "../../firebase-config";


interface SingleCommentComponentTypes {
  comment: SingleCommentTypesWithUser;
  postId: string;
  refreshFunction: (newComment: SingleCommentTypesWithUser) => void;
  updateDeleteComment : (id:string) => void;
}

function SingleComment({comment, postId, refreshFunction,updateDeleteComment}: SingleCommentComponentTypes) {
  const user = useContext(AuthContext);

  const [commentValue, setCommentValue] = useState<string>("")
  const [OpenReply, setOpenReply] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [userNotFound, setUserNotFound] = useState<boolean>(false)


  const userInfo = useUserUID(user)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(e.currentTarget.value)
  }

  const openReply = () => {
    setOpenReply(!OpenReply)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      setUserNotFound(true);
      return
    }
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
    const tempResult = result.docs.map(doc => ({...doc.data(), id: doc.id}))[0] as SingleCommentTypesWithUser;
    const getUserQuery = await query(usersCollectionRef, where(documentId(), "==", tempResult.writerUID));
    const userResult = await getDocs(getUserQuery);
    const userInformation = userResult.docs.map(doc => (doc.data()))[0] as userInfoTypes
    refreshFunction({
      ...tempResult,
      nickName: userInformation.nickName,
      avatar: userInformation.avatar,
      name: userInformation.name
    })
    setCommentValue("");
    setSuccess(true)
    setOpenReply(!OpenReply);
  }

  const deleteCommentHandler = async () => {
    await deleteDoc(doc(db,"comments",comment.id))
    updateDeleteComment(comment.id)
  }

  const actions = [
    <LikeDislikes comment commentId={comment.id}/>,
    <span onClick={openReply} key="comment-basic-reply-to">??????</span>,
    comment.writerUID === user?.uid && <span onClick={deleteCommentHandler} key="comment-basic-reply-to">??????</span>
  ]


  return (
    <div>

      <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"} content={"?????? ?????? ?????????????????? !"}/>

      <AntdCommentContainer>
        <Comment
          actions={actions}
          author={<Link
            to={user?.uid === comment.writerUID ? `/userPage/${user?.uid}` : `/otherUserPage/${comment.writerUID}`}>{comment.nickName}</Link>}
          avatar={
            <Link
              to={user?.uid === comment.writerUID ? `/userPage/${user?.uid}` : `/otherUserPage/${comment.writerUID}`}>
              <Avatar
                src={comment.avatar || "/images/personIcon.png"}
                alt="image"
              />
            </Link>
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
      <TopCenterSnackBar value={userNotFound} setValue={setUserNotFound} severity={"error"}
                         content={"????????? ??? ?????? ?????????????????? !"}/>

    </div>
  )
}

export default SingleComment