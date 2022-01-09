import React, {useEffect, useState} from 'react';
import {postTypes} from "../../utils/types";
import {communityCollectionRef} from "../../firestoreRef/ref";
import {getDocs, query, where} from "firebase/firestore";
import {LoadingArea, OtherUserHistoryContainer} from "./OtherUserPageStyles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Link} from "react-router-dom";
import moment from "moment";
import TableContainer from "@mui/material/TableContainer";
import {CircularProgress} from "@mui/material";

interface OtherUserPostHistoryProps {
  otherUserUID: string;
}

const OtherUserPostHistory = ({otherUserUID}: OtherUserPostHistoryProps) => {
  const [posts, setPosts] = useState<postTypes[]>();

  useEffect(() => {
    const getPosts = async () => {
      const q = await query(communityCollectionRef, where("writerUID", "==", otherUserUID))
      const result = await getDocs(q);
      setPosts(result.docs.map(doc => ({...doc.data(), id: doc.id})) as postTypes[])
    }
    getPosts()
  }, [])

  return (
    posts ? (
      <OtherUserHistoryContainer>
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead>
              <TableRow sx={{'th': {fontWeight: 'bold'}}}>
                <TableCell>제목</TableCell>
                <TableCell align="left">날짜&nbsp;</TableCell>
                <TableCell align="right">조회 수&nbsp;</TableCell>
                <TableCell align="right">추천 수 &nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts?.map((post) => (
                <TableRow
                  key={post.id}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell component="th" scope="row">
                    <Link to={`/communityDetail/${post.id}`}>
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell align="left">
                    {moment(post.createdAt.toDate()).format('YYYY년 MM월 DD일')}
                  </TableCell>

                  <TableCell align="right">{post.views}</TableCell>
                  <TableCell align="right">{post.loves}</TableCell>
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

export default OtherUserPostHistory;