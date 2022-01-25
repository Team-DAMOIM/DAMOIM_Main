import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import {
  UserImageWithInfo,
  UserMainCardSection, UserNameWithEmail,
  UserPageCardSection,
  UserPageContainer,
  UserPageHistorySection, UserPageInfoBox,
  UserSemiCardSection,
  UserPageFriendSection
} from "./userPageStyles";
import {CustomHalfTextArea} from "../CreatePartyPage/createPartyPageStyles";
import {AuthContext} from "../../context/AuthContext";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import CardWithIcon from "../../components/CardWithIcon/CardWithIcon";
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import ThermostatTwoToneIcon from '@mui/icons-material/ThermostatTwoTone';
import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone';
import UserPageFriends from "../../components/UserPageFriends/UserPageFriends";
import UserPagePostHistory from "./UserPagePostHistory";
import UserCommentHistory from "./UserCommentHistory";
import moment from "moment";
import 'moment/locale/ko';
import UserInfoChangeForm from "../../components/UserInfoChangeForm/UserInfoChangeForm";
import {getDocs, query, where} from "firebase/firestore";
import {relationsCollectionRef, usersCollectionRef} from "../../firestoreRef/ref";
import {relationTypes, userInfoTypes} from "../../utils/types";
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";
import FriendListForm from "../../components/FriendListForm/FriendListForm";
import LoadingCircularProgress from "../../components/LoadingCircularProgress/LoadingCircularProgress";

function UserPage(props: any) {
  const user = useContext(AuthContext);
  const [userInfoChangeOpen, setUserInfoChangeOpen] = useState<boolean>(false);
  const [userInfoChangeSuccess, setUserInfoChangeSuccess] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<userInfoTypes>();

  const [activeFriendModalOpen, setActiveFriendModalOpen] = useState<boolean>(false);
  const [friendUIDs, setFriendUIDs] = useState<string[]>([]);

  const [nonActiveFriendModalOpen, setNonActiveFriendModalOpen] = useState<boolean>(false);
  const [nonActiveFriendUIDs, setNonActiveFriendUIDs] = useState<string[]>([]);

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
    const getFriendUIDs = async () => {
      if (user) {
        const relationQuery1 = await query(relationsCollectionRef, where("member1", "==", user.uid), where("state", "==", "active"));
        const relationQuery2 = await query(relationsCollectionRef, where("member2", "==", user.uid), where("state", "==", "active"));
        const data1 = await getDocs(relationQuery1);
        const data2 = await getDocs(relationQuery2);

        let tempRelationData1: relationTypes[] = [];
        let tempRelationData2: relationTypes[] = [];
        let resultArr: string[] = [];

        if (data1.docs.length !== 0 || data2.docs.length !== 0) {
          if (data1.docs.length !== 0) {
            tempRelationData1 = data1.docs.map(doc => ({...doc.data()}) as relationTypes);
            tempRelationData1.map(relation => resultArr.push(relation.member2));
          }
          if (data2.docs.length !== 0) {
            tempRelationData2 = data2.docs.map(doc => ({...doc.data()}) as relationTypes);
            tempRelationData2.map(relation => resultArr.push(relation.member1));
          }
        }
        setFriendUIDs(resultArr);
      }
    }
    getFriendUIDs();
  }, [nonActiveFriendUIDs])

  useEffect(() => {
    const getNonActiveFriendUIDs = async () => {
      if (user) {
        const relationQuery = await query(relationsCollectionRef, where("member2", "==", user.uid), where("state", "==", "nonActive"));
        const data = await getDocs(relationQuery);

        let tempRelationData: relationTypes[] = [];
        let resultArr: string[] = [];
        if (data.docs.length !== 0) {
          tempRelationData = data.docs.map(doc => ({...doc.data()}) as relationTypes);
          tempRelationData.map(relation => resultArr.push(relation.member1));
        }
        setNonActiveFriendUIDs(resultArr);
      }
    }
    getNonActiveFriendUIDs();
  }, [])

  const [searchCategory, setSearchCategory] = useState("작성 글");

  const handleChange = (event: SelectChangeEvent) => {
    setSearchCategory(event.target.value);
  };

  if (!(user && userInfo && friendUIDs)) return <LoadingCircularProgress/>

  return (
    <UserPageContainer>
      <CustomHalfTextArea title='마이페이지'
                          content={`다모임과 ${moment(userInfo.createdAt.toDate()).fromNow()} 부터 함께하고 있어요 🥳`}/>
      <UserPageInfoBox>
        <UserPageCardSection>
          <UserMainCardSection>
            <UserImageWithInfo>
              <img src={userInfo.avatar || '/images/personIcon.png'} alt={"avatar"}/>
              <UserNameWithEmail>
                <h4>{userInfo.name}</h4>
                <span>{userInfo.nickName}</span>
                <span>{userInfo.email}</span>
              </UserNameWithEmail>
            </UserImageWithInfo>
            <Button variant="contained" startIcon={<ModeEditTwoToneIcon/>} onClick={() => {
              setUserInfoChangeOpen(true)
            }}>정보 수정</Button>
          </UserMainCardSection>

          <UserSemiCardSection>
            <CardWithIcon title={"회원권한"} content={"일반회원"} icon={<BadgeTwoToneIcon/>}/>
            <CardWithIcon title={"매너온도"} content={`${userInfo.temperature}`} icon={<ThermostatTwoToneIcon/>}/>
            <CardWithIcon title={"회원가입일"}
                          content={moment(userInfo.createdAt.toDate()).format('YYYY년 MM월 DD일')}
                          icon={<EventNoteTwoToneIcon/>}/>
          </UserSemiCardSection>
        </UserPageCardSection>

        <UserPageFriendSection>
          <Button
            variant="outlined"
            startIcon={<AddReactionOutlinedIcon/>}
            onClick={() => setNonActiveFriendModalOpen(true)}
            style={{flexGrow: '1', color: 'black', border: '1px solid black'}}
          >
            친구 요청 {nonActiveFriendUIDs.length}건
          </Button>
          <Button
            variant="outlined"
            startIcon={<EmojiPeopleOutlinedIcon/>}
            onClick={() => setActiveFriendModalOpen(true)}
            style={{flexGrow: '1', color: 'black', border: '1px solid black'}}
          >
            친구 {friendUIDs.length}명
          </Button>
        </UserPageFriendSection>

        <UserPageFriends/>
        <UserPageHistorySection>
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
            searchCategory === "작성 글" && <UserPagePostHistory/>
          }
          {
            searchCategory === "작성 댓글" && <UserCommentHistory/>
          }
        </UserPageHistorySection>
      </UserPageInfoBox>
      {
        userInfoChangeOpen &&
        <UserInfoChangeForm
          userInfoChangeOpen={userInfoChangeOpen}
          setUserInfoChangeOpen={setUserInfoChangeOpen}
          setUserInfo={setUserInfo as Dispatch<SetStateAction<userInfoTypes>>}
          userInfo={userInfo as userInfoTypes}
          setUserInfoChangeSuccess={setUserInfoChangeSuccess}
        />
      }

      {/* 친구 목록 모달 */}
      {
        activeFriendModalOpen &&
        <FriendListForm
          mode={0}
          formOpen={activeFriendModalOpen}
          setFormOpen={setActiveFriendModalOpen}
          userUID={user.uid} friendUIDs={friendUIDs}
          setFriendUIDs={setFriendUIDs}
        />
      }
      {
        nonActiveFriendModalOpen &&
        <FriendListForm
          mode={1}
          formOpen={nonActiveFriendModalOpen}
          setFormOpen={setNonActiveFriendModalOpen}
          userUID={user.uid} friendUIDs={nonActiveFriendUIDs}
          setFriendUIDs={setNonActiveFriendUIDs}
        />
      }
      <TopCenterSnackBar value={userInfoChangeSuccess} setValue={setUserInfoChangeSuccess} severity={"success"}
                         content={"프로필 정보 수정 성공!"}/>
    </UserPageContainer>
  )
}

export default UserPage;