import React, {Dispatch, SetStateAction, useState} from 'react';
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";


interface JoinPartyFormTypes {
  joinPartyOpen: boolean;
  setJoinPartyOpen: Dispatch<SetStateAction<boolean>>;
  setShowOpenChatLink: Dispatch<SetStateAction<boolean>>;
}

function JoinPartyForm({joinPartyOpen, setJoinPartyOpen, setShowOpenChatLink}: JoinPartyFormTypes) {

  const [success, setSuccess] = useState<boolean>(false)
  const handleClose = () => {
    setJoinPartyOpen(false);
  };

  const onSubmitPartyJoin = () => {
    handleClose();
    setShowOpenChatLink(true);
  }
  return (
    <div>
      <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"}
                         content={"신고가 접수되었습니다 확인 후 조치하겠습니다"}/>
      <Dialog open={joinPartyOpen} onClose={handleClose}>
        <DialogTitle>파티 참여</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span style={{color: 'black', fontWeight: 'bold'}}>오픈 채팅에 참여해주세요</span><br/><br/>
            우측하단에 오픈채팅 주소 확인 버튼을 누르면 파티장에게 알림 메세지가 전송됩니다. 오픈 채팅에 참가하여 파티원들과 대화를 나눈후
            파티장에게 다모임 페이지에서 파티를 수락해달라고 요청하세요!
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={onSubmitPartyJoin}>오픈채팅 주소 확인</Button>
        </DialogActions>
      </Dialog>
    </div>);
}

export default JoinPartyForm;