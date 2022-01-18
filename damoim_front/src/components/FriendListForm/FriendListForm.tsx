import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
  Avatar,
  Button,
  CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal
} from "@mui/material";
import {FriendListFormContainer, HeaderArea, MainArea, SLink} from "./FriendListFormStyles";
import CloseIcon from '@mui/icons-material/Close';
import {relationTypes, userInfoTypes} from "../../utils/types";
import {deleteDoc, getDocs, query, Timestamp, updateDoc, where} from "firebase/firestore";
import {relationsCollectionRef, usersCollectionRef} from "../../firestoreRef/ref";
import TopCenterSnackBar from "../TopCenterSnackBar/TopCenterSnackBar";

interface FriendListFormTypes {
  mode: number; // mode 0 : 친구 리스트 / mode 1 : 친구 수락 대기 리스트
  formOpen: boolean;
  setFormOpen: Dispatch<SetStateAction<boolean>>;
  userUID: string;
  friendUIDs: string[];
  setFriendUIDs: Dispatch<SetStateAction<string[]>>;
}

const FriendListForm = ({mode, formOpen, setFormOpen, userUID, friendUIDs, setFriendUIDs}: FriendListFormTypes) => {
  const [friendInfoData, setFriendInfoData] = useState<userInfoTypes[]>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [tempInfo, setTempInfo] = useState<userInfoTypes>();
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const getFriendInfo = async () => {
      const q = query(usersCollectionRef, where("uid", "in", friendUIDs));
      const data = await getDocs(q);

      setFriendInfoData(data.docs.map((doc) => ({...doc.data()} as userInfoTypes)));
    }
    getFriendInfo();
  }, [friendUIDs])

  const activeRelation = async (friendUID: string) => {
    const relationQuery1 = await query(relationsCollectionRef, where("member1", "==", userUID), where("member2", "==", friendUID), where("state", "==", "nonActive"));
    const relationQuery2 = await query(relationsCollectionRef, where("member1", "==", friendUID), where("member2", "==", userUID), where("state", "==", "nonActive"));
    const data1 = await getDocs(relationQuery1);
    const data2 = await getDocs(relationQuery2);
    if (data1.docs.length !== 0) {
      await updateDoc(data1.docs[0].ref, {
        state: "active"
      })
      setFriendUIDs(friendUIDs.filter(uid => uid !== friendUID));
    } else {
      await updateDoc(data2.docs[0].ref, {
        state: "active"
      })
      setFriendUIDs(friendUIDs.filter(uid => uid !== friendUID));
    }
  }


  const openDeleteDialog = (friendInfo: userInfoTypes) => {
    setTempInfo(friendInfo);
    setDialogOpen(true);
  }

  const onSubmitDeleteFriend = (friendUID: string) => {
    deleteFriend(friendUID, "active");
    setSuccess(true);
    setDialogOpen(false);
  }

  const deleteFriend = async (friendUID: string, state: string) => {
    const relationQuery1 = await query(relationsCollectionRef, where("member1", "==", userUID), where("member2", "==", friendUID), where("state", "==", state));
    const relationQuery2 = await query(relationsCollectionRef, where("member1", "==", friendUID), where("member2", "==", userUID), where("state", "==", state));
    const data1 = await getDocs(relationQuery1);
    const data2 = await getDocs(relationQuery2);
    if (data1.docs.length !== 0) {
      await deleteDoc(data1.docs[0].ref);
      setFriendUIDs(friendUIDs.filter(uid => uid !== friendUID));
    } else {
      await deleteDoc(data2.docs[0].ref);
      setFriendUIDs(friendUIDs.filter(uid => uid !== friendUID));
    }
  }

  switch (mode) {

    case 0:       // 친구 리스트
      return (
        <>
          <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"} content={"친구를 삭제했습니다."}/>
          <Modal
            open={formOpen}
            onClose={() => setFormOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <FriendListFormContainer>
              <HeaderArea>
                친구 목록
                <IconButton onClick={() => setFormOpen(false)} style={{position: 'absolute', right: '0'}}>
                  <CloseIcon/>
                </IconButton>
              </HeaderArea>
              <MainArea>
                {friendUIDs.length === 0 ? (
                  <p style={{marginTop: '100px', textAlign: 'center'}}>친구가 없네요<br/>친구를 추가해보세요 😉</p>
                ) : friendInfoData?.length === friendUIDs.length ? (
                  <List sx={{ width: '100%', maxHeight: '100%', overflow: 'auto' }}>
                    {friendInfoData.map(friendInfo => {
                      return (
                        <ListItem key={friendInfo.uid}>
                          <ListItemAvatar>
                            <Avatar src={friendInfo.avatar || '/images/personIcon.png'} alt={"avatar"}/>
                          </ListItemAvatar>
                          <SLink to={`/otherUserPage/${friendInfo.uid}`}>
                            <ListItemText primary={friendInfo.nickName} secondary={`${friendInfo.temperature}도`}/>
                          </SLink>
                          <Button variant="outlined" onClick={() => openDeleteDialog(friendInfo)}>삭제</Button>
                        </ListItem>
                      )
                    })}
                  </List>
                ) : (
                  <CircularProgress style={{margin: '100px auto', display: 'block'}}/>
                )}
              </MainArea>
            </FriendListFormContainer>
          </Modal>
          {
            tempInfo &&
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>친구 삭제</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                      <span style={{color: 'black', fontWeight: 'bold'}}>{tempInfo.nickName}님과의 친구 끊기</span><br/><br/>
                      <Avatar src={tempInfo.avatar || '/images/personIcon.png'} alt={"avatar"} style={{margin: 'auto'}}/><br/>
                      정말로 친구를 삭제하겠습니까? 생각이 바뀌면 친구를 다시 요청할 수 있습니다.
                  </DialogContentText>
                  <DialogActions>
                      <Button onClick={() => setDialogOpen(false)}>취소</Button>
                      <Button onClick={() => onSubmitDeleteFriend(tempInfo.uid)}>삭제</Button>
                  </DialogActions>
                </DialogContent>
              </Dialog>
          }
        </>
      );
      break

    case 1:       // 친구 수락 대기 리스트
      return (
        <Modal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <FriendListFormContainer>
            <HeaderArea>
              친구 요청 목록
              <IconButton onClick={() => setFormOpen(false)} style={{position: 'absolute', right: '0'}}>
                <CloseIcon/>
              </IconButton>
            </HeaderArea>
            <MainArea>
              {friendUIDs.length === 0 ? (
                <p style={{marginTop: '100px', textAlign: 'center'}}>들어온 친구 요청이 없습니다 😉</p>
              ) : friendInfoData?.length === friendUIDs.length ? (
                <List sx={{ width: '100%', maxHeight: '100%', overflow: 'auto' }}>
                  {friendInfoData.map(friendInfo => {
                    return (
                      <ListItem key={friendInfo.uid}>
                        <ListItemAvatar>
                          <Avatar src={friendInfo.avatar || '/images/personIcon.png'} alt={"avatar"}/>
                        </ListItemAvatar>
                        <SLink to={`/otherUserPage/${friendInfo.uid}`}>
                          <ListItemText primary={friendInfo.nickName} secondary={`${friendInfo.temperature}도`}/>
                        </SLink>
                        <Button variant="contained" onClick={() => activeRelation(friendInfo.uid)} style={{marginRight: '7px'}}>확인</Button>
                        <Button variant="outlined" onClick={() => deleteFriend(friendInfo.uid, "nonActive")}>삭제</Button>
                      </ListItem>
                    )
                  })}
                </List>
              ) : (
                <CircularProgress style={{margin: '100px auto', display: 'block'}}/>
              )}
            </MainArea>
          </FriendListFormContainer>
        </Modal>
      );
      break

    default:
      return (
        <>
          오류
        </>
      )
      break
  }
};

export default FriendListForm;