import React, {useEffect, useState} from 'react'
import SingleComment from './SingleComment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {SingleCommentTypes, SingleCommentTypesWithUser} from "../../utils/types";
import {ReplyCommentContainer, ReplyGuideContainer} from "./commentStyles";


interface ReplyCommentTypes {
  commentLists: SingleCommentTypesWithUser[];
  postId: string;
  parentCommentId: string;
  refreshFunction: (newComment: SingleCommentTypesWithUser) => void;
  updateDeleteComment: (id:string) => void;
}

function ReplyComment({commentLists, postId, parentCommentId, refreshFunction,updateDeleteComment}: ReplyCommentTypes) {
  const [ChildCommentNumber, setChildCommentNumber] = useState<number>(0)
  const [OpenReplyComments, setOpenReplyComments] = useState<boolean>(false)
  useEffect(() => {

    let commentNumber = 0;
    commentLists.map((comment: SingleCommentTypes) => {
      if (comment.responseTo === parentCommentId) {
        commentNumber++
      }
    })
    setChildCommentNumber(commentNumber)
  }, [commentLists])


  let renderReplyComment = (parentCommentId: string) =>
    commentLists.map((comment: SingleCommentTypesWithUser) => (
      <React.Fragment key={comment.id}>
        {comment.responseTo === parentCommentId &&
        <ReplyCommentContainer>
          <SingleComment comment={comment} postId={postId} refreshFunction={refreshFunction} updateDeleteComment={updateDeleteComment}/>
          <ReplyComment commentLists={commentLists} parentCommentId={comment.id} postId={postId}
                        refreshFunction={refreshFunction} updateDeleteComment={updateDeleteComment}/>
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
        onClick={handleChange}>
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