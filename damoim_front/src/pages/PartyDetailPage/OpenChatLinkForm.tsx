import React, {Dispatch, SetStateAction} from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";


interface OpenChatLinkFormTypes {
  showOpenChatLink: boolean;
  setShowOpenChatLink: Dispatch<SetStateAction<boolean>>;
  openChatLink: string
}

function OpenChatLinkForm({showOpenChatLink,setShowOpenChatLink,openChatLink}: OpenChatLinkFormTypes) {
  const handleClose = () => {
    setShowOpenChatLink(false);
  };

  return (
    <div>

      <Dialog open={showOpenChatLink} onClose={handleClose}>
        <DialogTitle>파티 참여</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span style={{color: 'black', fontWeight: 'bold'}}>카카오톡 오픈 채팅 주소</span><br/><br/>
            <span style={{color: '#777', fontWeight: 'bold'}}><a href={openChatLink}>{openChatLink}</a></span><br/><br/>
            파티장에게 알림 메세지가 전송되었습니다! 오픈 채팅에 참가하여 파티원들과 대화를 나눈후
            파티장에게 다모임 페이지에서 파티를 수락해달라고 요청하세요!
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>창닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default OpenChatLinkForm;