import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem, ListItemAvatar, ListItemText, Rating
} from "@mui/material";
import {userInfoTypes} from "../../utils/types";
import {addDoc, getDocs, query, Timestamp, where} from "firebase/firestore";
import {evaluationsCollectionRef, usersCollectionRef} from "../../firestoreRef/ref";
import {updateUserTemperature} from "../../utils/functions/calculateTemperature/updateUserTemperature";
import {updateAvgTemperature} from "../../utils/functions/calculateTemperature/updateAvgTemperature";

interface EvaluateOthersFormTypes {
  evaluateOthersOpen: boolean;
  setEvaluateOthersOpen: Dispatch<SetStateAction<boolean>>;
  memberUIDs: string[];
  userUID: string;
  partyID: string;
}

const EvaluateOthersForm = ({ evaluateOthersOpen, setEvaluateOthersOpen, memberUIDs, userUID, partyID }: EvaluateOthersFormTypes) => {
  const [memberInfoData, setMemberInfoData] = useState<userInfoTypes[]>();
  const [scores, setScores] = useState<number[]>(new Array(memberUIDs.length - 1).fill(0));

  const [otherMemberUIDs, setOtherMemberUIDs] = useState<string[] | null>();

  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const getMemberInfo = async () => {

      // 본인 uid를 제외한 나머지 멤버들의 uid를 구하는 과정 (otherMemberUIDs)
      let otherMemberUIDs: string[] = [];
      memberUIDs.map(uid => {
        if (uid !== userUID) {
          otherMemberUIDs.push(uid);
        }
      })
      console.log(otherMemberUIDs);
      setOtherMemberUIDs(otherMemberUIDs);

      const q = query(usersCollectionRef, where("uid", "in", otherMemberUIDs));
      const data = await getDocs(q);

      setMemberInfoData(data.docs.map((doc) => ({...doc.data()} as userInfoTypes)))
    }
    getMemberInfo()
  }, [])

  // // scores 변화 테스트
  // useEffect(() => {
  //   console.log(scores);
  // }, [scores])

  const onSubmit = () => {
    if (scores.includes(0)) { // 평가하지 않은 사람이 있을 경우
      alert("별점을 매겨 평가 후 확인을 눌러주세요!");
    } else {

      otherMemberUIDs?.map((uid, idx) => {

        let realScore: number = 0;
        switch (scores[idx]) {
          case 1:
            realScore = -1;
            break;
          case 2:
            realScore = -0.5;
            break;
          case 4:
            realScore = 0.5;
            break;
          case 5:
            realScore = 1;
            break;
        }

        const addEvaluation = async () => {
          await addDoc(evaluationsCollectionRef, {
            evaluatorUID: userUID,
            targetUID: uid,
            partyID: partyID,
            score: realScore,
            createdAt: Timestamp.fromDate(new Date())
          })
        }
        addEvaluation();

        updateUserTemperature(uid, realScore);
        updateAvgTemperature(uid, realScore, null);
      })

      setEvaluateOthersOpen(false);
      setSuccess(true);

    }
  }

  return (
    <>
      <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"} content={"평가를 완료했습니다!"}/>
      <Dialog open={evaluateOthersOpen} onClose={() => setEvaluateOthersOpen(false)}>
        <DialogTitle>다른 유저 평가</DialogTitle>
        <DialogContent>
          <List sx={{ width: '100%', maxHeight: '100%', overflow: 'auto' }}>
            {memberInfoData ? memberInfoData.map((memberInfo, idx) => {
              return(
                <ListItem key={memberInfo.uid}>
                  <ListItemAvatar>
                    <Avatar src={memberInfo.avatar || '/images/personIcon.png'} alt={"avatar"}/>
                  </ListItemAvatar>
                  <ListItemText primary={memberInfo.nickName}/>
                  <Rating
                    name="simple-controlled"
                    value={scores[idx]}
                    onChange={(event, newValue) => {
                      let scoresCopy = [...scores];
                      if (newValue) {
                        scoresCopy[idx] = newValue;
                        setScores(scoresCopy);
                      }
                    }}
                  />
                </ListItem>
              )
            }) : (
              <CircularProgress style={{margin: '100px auto', display: 'block'}}/>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onSubmit}>확인</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EvaluateOthersForm;