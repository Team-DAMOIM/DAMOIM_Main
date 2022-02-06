import React, {Dispatch, SetStateAction, useState} from 'react';
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {deleteDoc, doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase-config";

interface LeavePartyFormTypes {
  leavePartyOpen: boolean;
  setLeavePartyOpen: Dispatch<SetStateAction<boolean>>;
  acceptState: string;
  partyState: string;
  partyAcceptID: string;
  partyID: string;
  memberUIDs: string[];
  userUID: string;
}

const LeavePartyForm = ({ leavePartyOpen, setLeavePartyOpen, acceptState, partyState, partyAcceptID, partyID, memberUIDs, userUID }: LeavePartyFormTypes) => {

  const [success, setSuccess] = useState<boolean>(false);

  let title: string = "", content: string = "";
  switch (acceptState) {
    // 파티 신청 승인전
    case 'nonActive':
      title = "파티 신청 취소";
      content = "승인 되기 전 파티 신청은 자유롭게 취소할 수 있습니다. 취소 후 재신청도 가능합니다. 파티 신청을 취소하겠습니까?";
      break;

    // 파티 신청 승인후
    case 'active':
      title = "탈퇴 요청";
      if (partyState === "nonActive") { // 파티 시작전
        content = "파티가 시작되기 전 파티 탈퇴는 자유롭게 가능합니다. 파티를 탈퇴하겠습니까?";
      } else if (partyState === "active") { // 파티 시작후
        content = "파티가 시작된 후 구독 기간 중 탈퇴는 파티장의 승인하에만 가능합니다. 파티장에게 탈퇴를 요청하겠습니까?";
      }
      break;
  }

  const leaveParty = async () => {
    switch (acceptState) {
      // 파티 신청 승인전
      case 'nonActive':
        await deleteDoc(doc(db, 'partyAccepts', partyAcceptID));
        break;

      // 파티 신청 승인후
      case 'active':
        // await deleteDoc(doc(db, 'partyAccepts', partyAcceptID));
        
        // memberUIDs에서 해당 파티원의 UID만 뺀 배열
        let userDeleteMemberUIDs: string[] = memberUIDs.filter((uid) => uid !== userUID);
        
        if (partyState === "nonActive") { // 파티 시작전
          await deleteDoc(doc(db, 'partyAccepts', partyAcceptID));
          const partyRef = doc(db, 'partys', partyID);
          await updateDoc(partyRef, {
            memberUIDs: userDeleteMemberUIDs
          })
        } else if (partyState === "active") { // 파티 시작후
          // 여기 추후에 추가
        }
        break;
    }
    setLeavePartyOpen(false);
    setSuccess(true);
  }

  return (
    <>
      <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"} content={"파티 신청 취소/파티 탈퇴 요청이 완료되었습니다!"}/>
      <Dialog open={leavePartyOpen} onClose={() => setLeavePartyOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeavePartyOpen(false)}>취소</Button>
          <Button onClick={leaveParty}>확인</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LeavePartyForm;