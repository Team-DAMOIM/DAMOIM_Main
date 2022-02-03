import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {PartyAcceptTableContainer} from "./partyDetailPageStyles";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {partyAcceptTypes, partyTypes, postTypes, userInfoTypes} from "../../utils/types";
import {doc, documentId, getDoc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {
  partyAcceptsCollectionRef,
  partysCollectionRef,
} from "../../firestoreRef/ref";
import moment from "moment";
import UserWithProfile from "../../components/UserWithProfile/UserWithProfile";
import {LoadingButton} from "@mui/lab";
import {db} from "../../firebase-config";


interface PartyAcceptTableTypes {
  partyId: string;
  getUserData: (uid:string) => void
}


function PartyAcceptTable({partyId,getUserData}: PartyAcceptTableTypes) {


  const [acceptDatas, setAcceptDatas] = useState<partyAcceptTypes[]>([])
  const [loading, setLoading] = useState<boolean>(false);


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

    setLoading(true);

    const partyAcceptQuery = await query(partyAcceptsCollectionRef, where(documentId(), "==", partyAcceptId));
    const partyQuery = await query(partysCollectionRef, where(documentId(), "==", partyId));

    const partyAcceptData = await getDocs(partyAcceptQuery);
    const partyData = await getDocs(partyQuery);


    const memberNum: number = partyData.docs.map(doc => doc.data()).length;

    if (memberNum < 4) {

      /****************************************** 평균 온도 새로 계산 ******************************************/
      const calAvgTemperature = async () => {
        const docRef = doc(db, "users", applicantId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const applicantData: userInfoTypes = {...docSnap.data()} as userInfoTypes;

          const resultAvgTemp
            = Math.round((Number(partyData.docs.map(doc => doc.data())[0].avgTemperature) * memberNum + Number(applicantData.temperature)) / (memberNum + 1));
          console.log("기존 avgTemperature : ", partyData.docs.map(doc => doc.data())[0].avgTemperature);
          console.log("기존 avgTemperature의 타입 : ", typeof(Number(partyData.docs.map(doc => doc.data())[0].avgTemperature)));
          console.log("멤버 수 : ", memberNum);
          console.log("멤버수 타입 : ", typeof(memberNum));
          console.log("새로 들어온 멤버 온도 : ", applicantData.temperature);
          console.log("resultAvgTemp 결과", resultAvgTemp);
          console.log("반올림 전 결과", (Number(partyData.docs.map(doc => doc.data())[0].avgTemperature) * memberNum + Number(applicantData.temperature)) / (memberNum + 1));

          await updateDoc(partyData.docs[0].ref, {
            avgTemperature: resultAvgTemp
          })
        }
      }
      calAvgTemperature()
      /************************************************** ***************************************************/

      await updateDoc(partyAcceptData.docs[0].ref, {
        state: "active"
      })

      await updateDoc(partyData.docs[0].ref, {
        memberUIDs: [...partyData.docs.map(doc => doc.data())[0].memberUIDs, applicantId]
      })

      const q = await query(partyAcceptsCollectionRef, where("partyId", "==", partyId))
      const result = await getDocs(q);

      setAcceptDatas(result.docs.map(doc => ({...doc.data(), id: doc.id})) as partyAcceptTypes[])
      getUserData(applicantId)
      setLoading(false);
    } else {
      console.log("인원초과")
    }
  }


  const onRefuseHandler = async (partyAcceptId: string, applicantId: string) => {

    setLoading(true);

    const partyAcceptQuery = await query(partyAcceptsCollectionRef, where(documentId(), "==", partyAcceptId));

    const partyAcceptData = await getDocs(partyAcceptQuery);

    await updateDoc(partyAcceptData.docs[0].ref, {
      state: "refused"
    })

    const q = await query(partyAcceptsCollectionRef, where("partyId", "==", partyId))
    const result = await getDocs(q);

    setAcceptDatas(result.docs.map(doc => ({...doc.data(), id: doc.id})) as partyAcceptTypes[])
    setLoading(false);
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
            {/* acceptDatas에 nonActive인 파티 신청이 없을 경우 없다고 뜨게 처리한 것 */}
            {acceptDatas.find((data) => {
              if (data.state === "nonActive") {
                return true
              }
            }) ? acceptDatas.map((acceptData) => (
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
                  <TableCell align="right"> <LoadingButton loading={loading} variant={"outlined"} size={"small"}
                                                           onClick={() => {
                                                             onAcceptHandler(acceptData.id, acceptData.applicant)
                                                           }}>수락</LoadingButton></TableCell>
                  <TableCell align="right"> <LoadingButton onClick={() => {
                    onRefuseHandler(acceptData.id, acceptData.applicant)
                  }} loading={loading} variant={"outlined"} color={"error"}
                                                           size={"small"}>거부</LoadingButton></TableCell>
                </TableRow>
              )
            ) : (
              <div style={{margin: '30px auto', textAlign: 'center'}}>파티 참여를 신청한 사람이 없습니다.</div>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PartyAcceptTableContainer>
  );
}

export default PartyAcceptTable;
