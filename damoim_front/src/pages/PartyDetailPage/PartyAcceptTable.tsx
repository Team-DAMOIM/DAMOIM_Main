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
import {deleteDoc, doc, documentId, getDoc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {
  partyAcceptsCollectionRef,
  partysCollectionRef,
} from "../../firestoreRef/ref";
import moment from "moment";
import UserWithProfile from "../../components/UserWithProfile/UserWithProfile";
import {LoadingButton} from "@mui/lab";
import {db} from "../../firebase-config";
import {getPartySelectedOTTs} from "../../utils/functions";


interface PartyAcceptTableTypes {
  partyId: string;
  getUserData: (uid: string) => void;
  selectedOTTs: string[];
}


function PartyAcceptTable({partyId, getUserData, selectedOTTs}: PartyAcceptTableTypes) {


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

      /****************************************** ?????? ?????? ?????? ?????? ?????? ******************************************/
      // applicant??? ?????? ????????? ????????? ?????? ?????? ?????? ??? nonActive??? ????????? ?????? 
      const duplicateAcceptQuery = await query(partyAcceptsCollectionRef, where("applicant", "==", applicantId), where(documentId(), "!=", partyAcceptId), where("state", "==", "nonActive"));
      const duplicateAcceptData = await getDocs(duplicateAcceptQuery);
      
      if (duplicateAcceptData.docs.length !== 0) {
        
        duplicateAcceptData.docs.map(duplicateDoc => {
          const deleteDuplicate = async (partyID: string, partyAcceptID: string) => {
            const docRef = doc(db, 'partys', partyID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              // ?????? ???????????? ????????? OTT???(selectedOTTs) ??? ????????? ?????? ???????????? ????????? ?????? ????????? ?????? OTT(docSnap.data().selectedOTTs)????????? ?????????
              let isDuplicate: boolean = false;
              selectedOTTs.map(ott => {
                if (docSnap.data().selectedOTTs.includes(ott)) {
                  isDuplicate = true;
                }
              })

              if (isDuplicate) {
                // ?????? ?????? ????????? ??????
                await deleteDoc(doc(db, 'partyAccepts', partyAcceptID));
                isDuplicate = false;
              }
            }
          }

          deleteDuplicate(duplicateDoc.data().partyId, duplicateDoc.id);
        })

      }
      /**************************************************** *****************************************************/


      /****************************************** ?????? ?????? ?????? ?????? ******************************************/
      const docRef = doc(db, "users", applicantId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const applicantData: userInfoTypes = {...docSnap.data()} as userInfoTypes;

        const resultAvgTemp
          = Math.round((Number(partyData.docs.map(doc => doc.data())[0].avgTemperature) * memberNum + Number(applicantData.temperature)) / (memberNum + 1));

        await updateDoc(partyData.docs[0].ref, {
          avgTemperature: resultAvgTemp
        })
      }
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
      console.log("????????????")
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
              <TableCell align="left">?????????</TableCell>
              <TableCell align="left">?????? ??????</TableCell>
              <TableCell align="right">????????????</TableCell>
              <TableCell align="right">??????</TableCell>
              <TableCell align="right">??????</TableCell>
              <TableCell align="right">??????</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* acceptDatas??? nonActive??? ?????? ????????? ?????? ?????? ????????? ?????? ????????? ??? */}
            {acceptDatas.find((data) => {
              if (data.state === "nonActive") {
                return true
              }
            }) ? acceptDatas.map((acceptData) => (
                // ?????? ???????????? ???????????? ???????????? ?????????
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
                  <TableCell align="right">{moment(acceptData.createdAt.toDate()).format('MM??? DD???')}</TableCell>
                  <TableCell align="right"> <LoadingButton loading={loading} variant={"outlined"} size={"small"}
                                                           onClick={() => {
                                                             onAcceptHandler(acceptData.id, acceptData.applicant)
                                                           }}>??????</LoadingButton></TableCell>
                  <TableCell align="right"> <LoadingButton onClick={() => {
                    onRefuseHandler(acceptData.id, acceptData.applicant)
                  }} loading={loading} variant={"outlined"} color={"error"}
                                                           size={"small"}>??????</LoadingButton></TableCell>
                </TableRow>
              )
            ) : (
              <div style={{width: '100%', margin: '30px 0px', textAlign: 'center'}}>?????? ????????? ????????? ????????? ????????????.</div>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PartyAcceptTableContainer>
  );
}

export default PartyAcceptTable;
