import React, {useEffect, useState} from 'react';
import {SingleCommentTypes} from "../../utils/types";
import {getDocs, orderBy, query, where} from "firebase/firestore";
import {commentsCollectionRef, disLikesCollectionRef, likesCollectionRef} from "../../firestoreRef/ref";
import {LoadingArea, OtherUserHistoryContainer} from "./OtherUserPageStyles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import moment from "moment";
import TableContainer from "@mui/material/TableContainer";
import {CircularProgress} from "@mui/material";

interface OtherUserCommentHistoryProps {
  otherUserUID: string;
}

interface SingleCommentTypesWithLikes extends SingleCommentTypes{
  likes: number;
  disLikes: number
}

const OtherUserCommentHistory = ({otherUserUID}: OtherUserCommentHistoryProps) => {
  const [comments, setComments] = useState<SingleCommentTypesWithLikes[]>();

  useEffect(() => {
    const getComments = async () => {
      const q = await query(commentsCollectionRef, where("writerUID", "==", otherUserUID), orderBy("createdAt", "desc"));
      const result = await getDocs(q);
      const tempComments = result.docs.map(doc => ({...doc.data(), id: doc.id})) as SingleCommentTypesWithLikes[];
      let tempCommentsWithLikes: SingleCommentTypesWithLikes[] = [];
      tempComments.map(async (comment) => {
        const getLikeQuery = await query(likesCollectionRef, where("commentId", "==", comment.id))
        const getDisLikeQuery = await query(disLikesCollectionRef, where("commentId", "==", comment.id))
        const likeResult = await getDocs(getLikeQuery)
        const disLikeResult = await getDocs(getDisLikeQuery)
        const likes = likeResult.docs.map(doc => (doc.data())).length
        const disLikes = disLikeResult.docs.map(doc => (doc.data())).length
        tempCommentsWithLikes.push({...comment,likes,disLikes})
        if(tempComments.length === tempCommentsWithLikes.length){
          setComments(tempCommentsWithLikes)
        }
      })
    }
    getComments()
  }, [])

  return (
    comments ? (
      <OtherUserHistoryContainer>
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead>
              <TableRow sx={{'th': {fontWeight: 'bold'}}}>
                <TableCell>댓글</TableCell>
                <TableCell align="left">날짜&nbsp;</TableCell>
                <TableCell align="center">추천 수 &nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments?.map((comment) => (
                <TableRow
                  key={comment.id}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell component="th" scope="row">
                    {comment.content}
                  </TableCell>
                  <TableCell align="left">
                    {moment(comment.createdAt.toDate()).format('YYYY년 MM월 DD일')}
                  </TableCell>

                  <TableCell align="center">{comment.likes} / {comment.disLikes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </OtherUserHistoryContainer>
    ) : (
      <LoadingArea>
        <CircularProgress />
      </LoadingArea>
    )
  );
};

export default OtherUserCommentHistory;