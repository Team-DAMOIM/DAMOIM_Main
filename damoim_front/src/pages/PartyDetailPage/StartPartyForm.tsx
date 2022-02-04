import React, {Dispatch, SetStateAction, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {doc, Timestamp, updateDoc} from 'firebase/firestore';
import {db} from "../../firebase-config";
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";

interface StartPartyFormTypes {
  startPartyOpen: boolean;
  setStartPartyOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
}

const StartPartyForm = ({ startPartyOpen, setStartPartyOpen, id }: StartPartyFormTypes) => {

  const [success, setSuccess] = useState<boolean>(false);

  const startParty = async (partyID: string) => {
    const partyRef = doc(db, 'partys', partyID);
    await updateDoc(partyRef, {
      state: "active",
      activeDate: Timestamp.fromDate(new Date())
    })
    setStartPartyOpen(false);
    setSuccess(true);
  };

  return (
    <>
      <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"} content={"파티가 활성화 되었습니다!"}/>
      <Dialog open={startPartyOpen} onClose={() => setStartPartyOpen(false)}>
        <DialogTitle>파티 시작</DialogTitle>
        <DialogContent>
          <DialogContentText>
            파티를 정말 시작하겠습니까? 한 번 시작한 파티는 구독기간동안 중지할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStartPartyOpen(false)}>취소</Button>
          <Button onClick={() => startParty(id)}>확인</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StartPartyForm;