import React, {ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {partyAcceptsCollectionRef} from "../../firestoreRef/ref";
import {addDoc, getDocs, query, Timestamp, where} from "firebase/firestore";
import {AuthContext} from "../../context/AuthContext";
import {LoadingButton} from "@mui/lab";
import TextField from "@mui/material/TextField";
import useUserUID from "../../hooks/useUserUID";


interface JoinPartyFormTypes {
  joinPartyOpen: boolean;
  setJoinPartyOpen: Dispatch<SetStateAction<boolean>>;
  setShowOpenChatLink: Dispatch<SetStateAction<boolean>>;
  masterUID: string,
  partyId: string
  setShowPartyJoinSuccessSnackBar: Dispatch<SetStateAction<boolean>>,
  setShowPartyJoinDuplicateSnackBar: Dispatch<SetStateAction<boolean>>,
  setShowPartyJoinFailSnackBar: Dispatch<SetStateAction<boolean>>
}

function JoinPartyForm({
                         joinPartyOpen,
                         setJoinPartyOpen,
                         setShowOpenChatLink,
                         masterUID,
                         partyId,
                         setShowPartyJoinSuccessSnackBar,
                         setShowPartyJoinDuplicateSnackBar,
                       }: JoinPartyFormTypes) {

  const user = useContext(AuthContext);
  const userInfo = useUserUID(user);

  const [success, setSuccess] = useState<boolean>(false)
  const [partyJoinLoading, setPartyJoinLoading] = useState<boolean>(false);
  const [partyJoinTalk, setPartyJoinTalk] = useState<string>("")

  const handleClose = () => {
    setJoinPartyOpen(false);
  };

  const onSubmitPartyJoin = async () => {
    // 파티장에게 수락메세지 보내는 로직
    setPartyJoinLoading(true);

    // 이미 파티참여 신청이 있는지 중복 체크
    const duplicateCheckQuery = await query(partyAcceptsCollectionRef, where("partyId", "==", partyId), where("applicant", "==", user?.uid))
    const duplicateCheckData = await getDocs(duplicateCheckQuery);
    const isDuplicated = duplicateCheckData.docs.map(doc => ({...doc.data(), id: doc.id})).length !== 0
    console.log(userInfo)
    if (!isDuplicated) {
      await addDoc(partyAcceptsCollectionRef, {
        master: masterUID,
        applicant: user?.uid,
        partyId,
        state: "nonActive",
        createdAt: Timestamp.fromDate(new Date()),
        partyJoinTalk: partyJoinTalk,
        avatar:userInfo?.avatar || "/images/personIcon.png" ,
        nickName:userInfo?.nickName,
        temperature:userInfo?.temperature
      })
      setShowPartyJoinSuccessSnackBar(true);
    } else {
      setShowPartyJoinDuplicateSnackBar(true);
    }


    setPartyJoinLoading(false)
    setShowOpenChatLink(true);


    handleClose();
  }

  const textFieldChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setPartyJoinTalk(event.target.value)
  }


  return (
    <div>
      <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"}
                         content={"파티 신청 완료!"}/>
      <Dialog open={joinPartyOpen} onClose={handleClose}>
        <DialogTitle>파티 참여</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span style={{color: 'black', fontWeight: 'bold'}}>오픈 채팅에 참여해주세요</span><br/><br/>
            우측하단에 오픈채팅 주소 확인 버튼을 누르면 파티장에게 알림 메세지가 전송됩니다. 파티장에게 전하고자 하는 메세지를 작성해주세요!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="한마디"
            type="text"
            fullWidth
            variant="standard"
            value={partyJoinTalk}
            placeholder={"30자 이내로 작성해주세요"}
            onChange={textFieldChangeHandler}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <LoadingButton loading={partyJoinLoading} onClick={onSubmitPartyJoin}>오픈채팅 주소 확인</LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default JoinPartyForm;