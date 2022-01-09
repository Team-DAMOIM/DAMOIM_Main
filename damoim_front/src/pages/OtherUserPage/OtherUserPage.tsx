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
import {getDocs, query, where} from "firebase/firestore";
import {usersCollectionRef} from "../../firestoreRef/ref";
import {userInfoTypes} from "../../utils/types";
import {AuthContext} from "../../context/AuthContext";
import {useParams} from "react-router-dom";
import ModeEditTwoToneIcon from "@mui/icons-material/ModeEditTwoTone";
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
import OtherUserPostHistory from "./OtherUserPostHistory";
import OtherUserCommentHistory from "./OtherUserCommentHistory";

const OtherUserPage = () => {
  // OtherUser UID
  const { id } = useParams<{ id: string }>();

  const user = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<userInfoTypes>();
  const [otherUserInfo, setOtherUserInfo] = useState<userInfoTypes>();

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const userQuery = await query(usersCollectionRef, where("uid", "==", user.uid))
        const data = await getDocs(userQuery);
        setUserInfo(data.docs.map(doc => ({...doc.data()}))[0] as userInfoTypes);
      }
    }
    getUser();
  }, [])

  useEffect(() => {
    const getOtherUser = async () => {
      if (user) {
        const userQuery = await query(usersCollectionRef, where("uid", "==", id))
        const data = await getDocs(userQuery);
        setOtherUserInfo(data.docs.map(doc => ({...doc.data()}))[0] as userInfoTypes);
      }
    }
    getOtherUser();
  }, [])

  const [searchCategory, setSearchCategory] = useState("작성 글");

  const handleChange = (event: SelectChangeEvent) => {
    setSearchCategory(event.target.value);
  };

  // 친구 추가 함수 만들어야함!
  const addFriend = (userUID: string, otherUserUID: string) => {

  };

  return (
    userInfo && otherUserInfo ? (
      <OtherUserPageContainer>
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
            <Button variant="contained" startIcon={<ModeEditTwoToneIcon/>} onClick={() => {
              addFriend(userInfo.uid, otherUserInfo.uid);
            }}>친구추가</Button>
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
    ) : (
      <LoadingArea>
        <CircularProgress />
      </LoadingArea>
    )
  );
};

export default OtherUserPage;