import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {PartyAcceptTableContainer} from "./partyDetailPageStyles";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {partyAcceptTypes, postTypes} from "../../utils/types";
import {documentId, getDocs, query, updateDoc, where} from "firebase/firestore";
import {
  partyAcceptsCollectionRef,
  partysCollectionRef,
} from "../../firestoreRef/ref";
import moment from "moment";
import UserWithProfile from "../../components/UserWithProfile/UserWithProfile";
import {Button} from "@mui/material";


interface PartyAcceptTableTypes {
  partyId: string;
}


function PartyAcceptTable({partyId}: PartyAcceptTableTypes) {


  const [acceptDatas, setAcceptDatas] = useState<partyAcceptTypes[]>([])

  useEffect(() => {
    const getAcceptDatas = async () => {
      const q = await query(partyAcceptsCollectionRef, where("partyId", "==", partyId))
      const result = await getDocs(q);

      setAcceptDatas(result.docs.map(doc => ({...doc.data(), id: doc.id})) as partyAcceptTypes[])
    }
    getAcceptDatas()

    return () => {
      setAcceptDatas([]);
    }
  }, [])


  const onAcceptHandler = async (partyAcceptId: string, applicantId: string) => {
    const partyAcceptQuery = await query(partyAcceptsCollectionRef, where(documentId(), "==", partyAcceptId));
    const partyQuery = await query(partysCollectionRef, where(documentId(), "==", partyId));

    const partyAcceptData = await getDocs(partyAcceptQuery);
    const partyData = await getDocs(partyQuery);


    if (partyData.docs.map(doc => doc.data()).length < 4) {
      await updateDoc(partyAcceptData.docs[0].ref, {
        state: "active"
      })

      await updateDoc(partyData.docs[0].ref, {
        memberUIDs: [...partyData.docs.map(doc => doc.data())[0].memberUIDs, applicantId]
      })
    } else {
      console.log("인원초과")
    }
  }


  return (
    <PartyAcceptTableContainer>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow sx={{'th': {fontWeight: 'bold'}}}>
              <TableCell align="left">닉네임</TableCell>
              <TableCell align="left">신청 문구</TableCell>
              <TableCell align="right">매너온도</TableCell>
              <TableCell align="right">날짜</TableCell>
              <TableCell align="right">수락</TableCell>
              <TableCell align="right">거부</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {acceptDatas?.map((acceptData) => (
              // 아직 처리안된 파티참여 메시지만 보여줌
                acceptData.state === "nonActive" &&
                <TableRow
                  key={acceptData.id}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell align="left" sx={{'&': {whiteSpace: 'pre'}}}>
                    <UserWithProfile
                      uid={acceptData.applicant}
                      img={acceptData.avatar || "/images/personIcon.png"}
                      userName={acceptData.nickName as string}/>
                  </TableCell>
                  <TableCell align="left">
                    {acceptData.partyJoinTalk}
                  </TableCell>
                  <TableCell align="right">{acceptData.temperature}</TableCell>
                  <TableCell align="right">{moment(acceptData.createdAt.toDate()).format('MM월 DD일')}</TableCell>
                  <TableCell align="right"> <Button variant={"outlined"} size={"small"} onClick={() => {
                    onAcceptHandler(acceptData.id, acceptData.applicant)
                  }}>수락</Button></TableCell>
                  <TableCell align="right"> <Button variant={"outlined"} color={"error"}
                                                    size={"small"}>거부</Button></TableCell>
                </TableRow>
              )
            )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </PartyAcceptTableContainer>
  );
}

export default PartyAcceptTable;
