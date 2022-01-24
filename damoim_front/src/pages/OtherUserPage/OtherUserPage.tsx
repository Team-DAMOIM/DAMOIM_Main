import React, {useContext, useEffect, useState} from 'react';
import {
  MainInfoCard,
  OtherUserInfoBox,
  OtherUserPageContainer,
  UserImageWithInfo,
  UserNameWithEmail,
  LoadingArea,
  AdditionalInfoCard, OtherUserHistorySection
} from "./OtherUserPageStyles";
import {CustomHalfTextArea} from "../CreatePartyPage/createPartyPageStyles";
import moment from "moment";
import {addDoc, getDocs, query, Timestamp, where} from "firebase/firestore";
import {relationsCollectionRef, usersCollectionRef} from "../../firestoreRef/ref";
import {relationTypes, userInfoTypes} from "../../utils/types";
import {AuthContext} from "../../context/AuthContext";
import {useParams} from "react-router-dom";
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import CardWithIcon from "../../components/CardWithIcon/CardWithIcon";
import BadgeTwoToneIcon from "@mui/icons-material/BadgeTwoTone";
import ThermostatTwoToneIcon from "@mui/icons-material/ThermostatTwoTone";
import EventNoteTwoToneIcon from "@mui/icons-material/EventNoteTwoTone";
import AddIcon from '@mui/icons-material/Add';
import OtherUserPostHistory from "./OtherUserPostHistory";
import OtherUserCommentHistory from "./OtherUserCommentHistory";
import CreateIcon from "@mui/icons-material/Create";
import {LoadingButton} from "@mui/lab";
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";
import LoadingCircularProgress from "../../components/LoadingCircularProgress/LoadingCircularProgress";

const OtherUserPage = () => {
  // OtherUser UID
  const {id} = useParams<{ id: string }>();

  const [nonLogin, setNonLogin] = useState<boolean>(false);

  const user = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<userInfoTypes>();
  const [otherUserInfo, setOtherUserInfo] = useState<userInfoTypes>();
  const [relation, setRelation] = useState<relationTypes>({
    member1: "",
    member2: "",
    state: "notFriend",
    createdAt: Timestamp.fromDate(new Date())
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false)
  const [fail, setFail] = useState<boolean>(false)

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const userQuery = await query(usersCollectionRef, where("uid", "==", user.uid));
        const data = await getDocs(userQuery);
        setUserInfo(data.docs.map(doc => ({...doc.data()}))[0] as userInfoTypes);
      } else {
        setNonLogin(true);
      }
    }
    getUser();
  }, [])

  useEffect(() => {
    const getOtherUser = async () => {
      const userQuery = await query(usersCollectionRef, where("uid", "==", id));
      const data = await getDocs(userQuery);
      setOtherUserInfo(data.docs.map(doc => ({...doc.data()}))[0] as userInfoTypes);
    }
    getOtherUser();
  }, [])

  useEffect(() => {
    const getRelations = async () => {
      if (user) {
        const relationQuery1 = await query(relationsCollectionRef, where("member1", "==", user.uid), where("member2", "==", id));
        const relationQuery2 = await query(relationsCollectionRef, where("member1", "==", id), where("member2", "==", user.uid));
        const data1 = await getDocs(relationQuery1);
        const data2 = await getDocs(relationQuery2);
        if (data1.docs.length !== 0 || data2.docs.length !== 0) {
          if (data1.docs.length !== 0) {
            setRelation(data1.docs.map(doc => ({...doc.data()}))[0] as relationTypes);
          } else {
            setRelation(data2.docs.map(doc => ({...doc.data()}))[0] as relationTypes);
          }
        }
      }
    }
    getRelations();
  }, [success])

  const [searchCategory, setSearchCategory] = useState("작성 글");

  const handleChange = (event: SelectChangeEvent) => {
    setSearchCategory(event.target.value);
  };

  // 친구 추가 함수 만들어야함!
  const addFriend = async (userUID: string, otherUserUID: string) => {
    setLoading(true);
    await addDoc(relationsCollectionRef, {
      member1: userUID,
      member2: otherUserUID,
      state: "nonActive",
      createdAt: Timestamp.fromDate(new Date())
    })
    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 2000)
  };

  if (!((userInfo || nonLogin) && otherUserInfo)) return <LoadingCircularProgress/>

  return (
    <OtherUserPageContainer>

      <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"}
                         content={"친구 신청을 완료했습니다. 상대가 수락하면 친구 목록에 표시됩니다."}/>
      <TopCenterSnackBar value={fail} setValue={setFail} severity={"error"} content={"친구 신청에 실패했습니다."}/>

      <CustomHalfTextArea
        title={`"${otherUserInfo.nickName}" 회원님의 상세정보`}
        content={`다모임과 ${moment(otherUserInfo.createdAt.toDate()).fromNow()} 부터 함께하고 있어요 🥳`}
      />
      <OtherUserInfoBox>
        <MainInfoCard>
          <UserImageWithInfo>
            <img src={otherUserInfo.avatar || '/images/personIcon.png'} alt={"avatar"}/>
            <UserNameWithEmail>
              <h4>{otherUserInfo.name}</h4>
              <span>{otherUserInfo.nickName}</span>
              <span>{otherUserInfo.email}</span>
            </UserNameWithEmail>
          </UserImageWithInfo>
          {nonLogin ? <div></div> : userInfo && relation.state === "notFriend" ? (
            <LoadingButton
              variant="contained"
              startIcon={<AddIcon/>}
              onClick={() => {
                addFriend(userInfo.uid, otherUserInfo.uid);
              }}
              loading={loading}
            >
              친구신청
            </LoadingButton>
          ) : relation.state === "active" ? (
            <Button>친구</Button>
          ) : relation.state === "nonActive" ? (
            <Button>친구 신청 중</Button>
          ) : <Button>처리 중 (차단 시 해당 처리 예정)</Button>}
        </MainInfoCard>

        <AdditionalInfoCard>
          <CardWithIcon title={"회원권한"} content={"일반회원"} icon={<BadgeTwoToneIcon/>}/>
          <CardWithIcon title={"매너온도"} content={`${otherUserInfo.temperature}`} icon={<ThermostatTwoToneIcon/>}/>
          <CardWithIcon title={"회원가입일"}
                        content={moment(otherUserInfo.createdAt.toDate()).format('YYYY년 MM월 DD일')}
                        icon={<EventNoteTwoToneIcon/>}/>
        </AdditionalInfoCard>

        <OtherUserHistorySection>
          <FormControl sx={{mb: 1, minWidth: 120}}>
            <InputLabel id="demo-simple-select-helper-label">조회</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={searchCategory}
              label="조회"
              onChange={handleChange}
            >
              <MenuItem value={'작성 글'}>작성 글</MenuItem>
              <MenuItem value={'작성 댓글'}>작성 댓글</MenuItem>
              <MenuItem value={'로그인 기록'} disabled>로그인 기록</MenuItem>
              <MenuItem value={'쪽지함'} disabled>쪽지함</MenuItem>
              <MenuItem value={'회원차단내역'} disabled>회원차단내역</MenuItem>
            </Select>
            <FormHelperText>조회하고싶은 것을 선택해주세요</FormHelperText>
          </FormControl>
          {
            searchCategory === "작성 글" && <OtherUserPostHistory otherUserUID={otherUserInfo.uid}/>
          }
          {
            searchCategory === "작성 댓글" && <OtherUserCommentHistory otherUserUID={otherUserInfo.uid}/>
          }
        </OtherUserHistorySection>
      </OtherUserInfoBox>
    </OtherUserPageContainer>
  );
};

export default OtherUserPage;