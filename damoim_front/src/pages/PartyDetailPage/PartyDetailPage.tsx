import {doc, getDoc, getDocs, query, where} from 'firebase/firestore';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {db} from '../../firebase-config';
import {
  DetailBox,
  MemberInfoBox,
  MemberInfoBoxFlexStart,
  MemberInfoContainer,
  InfoText,
  PartyDetailPageContainer,
  PersonIconLink,
  PersonIconNotLink,
  SelectedOTTBox,
  TrimOTTIcon,
  InfoTextArea,
  MemberTalkBox,
  MemberTalkArea,
  JoinButtonContainer
} from './partyDetailPageStyles';
import {partyTypes, userInfoTypes} from "../../utils/types";
import moment from "moment";
import CardWithIcon from "../../components/CardWithIcon/CardWithIcon";
import DateRangeTwoToneIcon from '@mui/icons-material/DateRangeTwoTone';
import TimelapseTwoToneIcon from '@mui/icons-material/TimelapseTwoTone';
import {Button} from "@mui/material";
import {AuthContext} from "../../context/AuthContext";
import JoinPartyForm from "./JoinPartyForm";
import OpenChatLinkForm from "./OpenChatLinkForm";
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";
import PartyAcceptTable from "./PartyAcceptTable";
import LoadingCircularProgress from "../../components/LoadingCircularProgress/LoadingCircularProgress";
import {partyAcceptsCollectionRef} from "../../firestoreRef/ref";

const PartyDetailPage = () => {
  const {id} = useParams<{ id: string }>();
  const user = useContext(AuthContext);

  const [partyData, setPartyData] = useState<partyTypes | null>();
  const [selectedOTT, setSelectedOTT] = useState<string[]>([]);
  const [memberUIDs, setMemberUIDs] = useState<string[]>([]);
  const [memberData, setMemberData] = useState<userInfoTypes[]>([]);
  const [joinPartyOpen, setJoinPartyOpen] = useState<boolean>(false)
  const [showOpenChatLink, setShowOpenChatLink] = useState<boolean>(false)
  const [showPartyJoinSuccessSnackBar, setShowPartyJoinSuccessSnackBar] = useState<boolean>(false);
  const [showPartyJoinDuplicateSnackBar, setShowPartyJoinDuplicateSnackBar] = useState<boolean>(false);
  const [showPartyJoinFailSnackBar, setShowPartyJoinFailSnackBar] = useState<boolean>(false);
  const [partyAcceptsLength, setPartyAcceptsLength] = useState<number>(0)
  const [alreadySubmit, setAlreadySubmit] = useState<boolean>(false)

  const getPartyData = async (partyId: string) => {
    const docRef = doc(db, "partys", partyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setPartyData({
        id: partyId,
        hostUID: docSnap.data().hostUID,
        memberUIDs: docSnap.data().memberUIDs,
        openChatLink: docSnap.data().openChatLink,
        selectedOTTs: docSnap.data().selectedOTTs,
        startDate: docSnap.data().startDate,
        wishPeriod: docSnap.data().wishPeriod,
        createdAt: docSnap.data().createdAt,
        memberTalk: docSnap.data().memberTalk
      });
      setSelectedOTT(docSnap.data().selectedOTTs);
      setMemberUIDs(docSnap.data().memberUIDs);

      for (let i = 0; i < docSnap.data().memberUIDs.length; i++) {
        // docSnap.data().memberUIDs 말고 memberUIDs를 사용하면 useState도 비동기이기 때문에 undefined가 들어간다.
        getUserData(docSnap.data().memberUIDs[i]);
      }

    } else {
      console.log("No such document!");
    }
  }

  const getUserData = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setMemberData(memberData => [...memberData, {
        uid: docSnap.data().uid,
        name: docSnap.data().name,
        nickName: docSnap.data().nickName,
        isOnline: docSnap.data().isOnline,
        email: docSnap.data().email,
        createdAt: docSnap.data().createdAt,
        avatar: docSnap.data().avatar,
        avatarPath: docSnap.data().avatarPath,
        temperature: docSnap.data().temperature,
        joinPeriod: docSnap.data().joinPeriod
      }]);
    } else {
      console.log("No such document!");
    }
  }

  useEffect(() => {
    getPartyData(id)
  }, [])


  // 파티참여 지금까지 신청한사람 명수 구하기
  useEffect(() => {
    const getPartyAccepts = async () => {
      const partyAcceptsQuery = await query(partyAcceptsCollectionRef, where("partyId", "==", id))
      const data = await getDocs(partyAcceptsQuery);
      setPartyAcceptsLength(data.docs.map(doc => doc.data()).length)
    }
    getPartyAccepts()
  }, [])


  // 이미 파티참여를 신청했는지 가져오기

  useEffect(() => {
    const partyAlreadyAcceptQuery = async () => {
      const partyAlreadyAcceptQuery = await query(partyAcceptsCollectionRef, where("partyId", "==", id), where("applicant", "==", user?.uid))
      const data = await getDocs(partyAlreadyAcceptQuery);
      if (data.docs.map(doc => doc.data())[0]) setAlreadySubmit(true)
    }

    partyAlreadyAcceptQuery();

  }, [])


  if (!(partyData && (selectedOTT.length !== 0)   // partyData 받아오고 선택한 OTT 데이터 받아오면
    && (memberUIDs.length !== 0) && (memberData.length === memberUIDs.length))) {  // 여기중요! memberUID목록을 받아오면 (length가 0이 아닐 때) 해당 member수와 받아온 memberData 수가 일치하는지 확인
    return <LoadingCircularProgress/>
  }

  return (
    <PartyDetailPageContainer>
      <DetailBox>
        <SelectedOTTBox>
          {selectedOTT.map(OTT => {
            return (
              <TrimOTTIcon key={OTT}>
                <img src={`/images/OTTIcons/${OTT}Icon.png`}/>
              </TrimOTTIcon>
            )
          })}
        </SelectedOTTBox>
        <MemberInfoContainer>
          {[0, 1, 2, 3].map(idx => {
            if (idx < memberData.length) {
              return (
                <MemberInfoBox key={idx}>
                  <InfoText isBold={true} fontSize='14px' fontColor='black'
                            textAlign='center'>{memberData[idx].uid === partyData?.hostUID ? "파티장" : "파티원"}</InfoText>
                  {/* 아래 삼항연산자 설명 : 만약 자기 프로필을 클릭하면 otherUserPage로 가는게 아니라 userPage(마이페이지)로 갈 수 있게 처리 */}
                  <PersonIconLink
                    to={user ? (memberData[idx].uid === user.uid) ? `/userPage/${user.uid}` : `/otherUserPage/${memberData[idx].uid}` : `/otherUserPage/${memberData[idx].uid}`}/>
                  <InfoText isBold={true} fontSize='18px' fontColor='black'
                            textAlign='center'>{memberData[idx].nickName}</InfoText>
                  <InfoText isBold={true} fontSize='18px' textAlign='center'
                            fontColor={memberData[idx].temperature < 30 ? "gray"
                              : memberData[idx].temperature < 40 ? "blue"
                                : memberData[idx].temperature < 50 ? "orange"
                                  : "red"}
                  >
                    {memberData[idx].temperature}도
                  </InfoText>
                  <InfoText isBold={false} fontSize='12px' fontColor='black' textAlign='center'>
                    {memberData[idx].joinPeriod}개월 참여
                  </InfoText>
                </MemberInfoBox>
              )
            } else {
              return (
                <MemberInfoBoxFlexStart key={idx}>
                  <InfoText isBold={true} fontSize='14px' fontColor='black' textAlign='center'>빈자리</InfoText>
                  <PersonIconNotLink/>
                </MemberInfoBoxFlexStart>
              )
            }
          })}
        </MemberInfoContainer>
        <InfoTextArea>
          <CardWithIcon title={"시작일(갱신일)"} content={moment(partyData.startDate.toDate()).format('YYYY년 MM월 DD일 ~')}
                        icon={<DateRangeTwoToneIcon/>}/>
          <CardWithIcon title={"구독희망기간"} content={`${partyData.wishPeriod}개월`} icon={<TimelapseTwoToneIcon/>}/>
          {/*<CardWithIcon title={"오픈채팅 URL"} content={partyData.openChatLink} icon={<ChatBubbleTwoToneIcon/>}/>*/}

          {/*<InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>시작일(갱신일)</InfoText>*/}
          {/*<InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{moment(partyData.startDate.toDate()).format('YYYY년 MM월 DD일 ~')}</InfoText>*/}

          {/*<InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>구독희망기간</InfoText>*/}
          {/*<InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{partyData.wishPeriod}개월</InfoText>*/}

          {/*<InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>오픈채팅 URL</InfoText>*/}
          {/*<InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'><a href={partyData.openChatLink}>{partyData.openChatLink}</a></InfoText>*/}
        </InfoTextArea>
        <MemberTalkBox>
          <InfoText isBold={true} fontSize='16px' fontColor='black' textAlign='left'>파티원들의 한마디</InfoText>
          <MemberTalkArea>
            <InfoText isBold={true} fontSize='16px' fontColor='black'
                      textAlign='left'>{memberData[0].nickName}(파티장)</InfoText>
            <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'
                      style={{marginTop: '10px'}}>{partyData.memberTalk}</InfoText>
            <br/>
            {/* <InfoText isBold={true} fontSize='16px' fontColor='black' textAlign='left'>Dan2029(파티원1)</InfoText>

              <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{partyData.member2}</InfoText>
              <br/>
              <InfoText isBold={true} fontSize='16px' fontColor='black' textAlign='left'></InfoText>
              <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{partyData[1].member3}</InfoText>
              <br/>
              <InfoText isBold={true} fontSize='16px' fontColor='black' textAlign='left'></InfoText>
              <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{partyData[1].member4}</InfoText> */}
          </MemberTalkArea>
        </MemberTalkBox>
        <JoinButtonContainer>
          {
            user?.uid !== partyData.hostUID &&
            alreadySubmit ? <Button onClick={() => {
                setShowOpenChatLink(true);
              }} variant={"outlined"}>오픈 채팅 주소보기</Button>
              :
              <Button disabled={memberUIDs.length === 4} onClick={() => {
                setJoinPartyOpen(true);
              }} variant={"outlined"}>파티 참여</Button>
          }
          <span>현재 {partyAcceptsLength}명이 이 파티에 관심있습니다</span>
        </JoinButtonContainer>


        {/*const [showPartyJoinSuccessSnackBar,setShowPartyJoinSuccessSnackBar] = useState<boolean>(false);*/}
        {/*const [showPartyJoinDuplicateSnackBar,setShowPartyJoinDuplicateSnackBar] = useState<boolean>(false);*/}
        {/*  const [showPartyJoinFailSnackBar,setShowPartyJoinFailSnackBar] = useState<boolean>(false);*/}

        {
          user?.uid === partyData.hostUID &&
          <PartyAcceptTable partyId={partyData.id}/>
        }
      </DetailBox>

      {/*파티 참여 모달*/}
      <JoinPartyForm joinPartyOpen={joinPartyOpen}
                     setJoinPartyOpen={setJoinPartyOpen}
                     setShowOpenChatLink={setShowOpenChatLink}
                     masterUID={partyData.hostUID}
                     partyId={partyData.id}
                     setShowPartyJoinSuccessSnackBar={setShowPartyJoinSuccessSnackBar}
                     setShowPartyJoinDuplicateSnackBar={setShowPartyJoinDuplicateSnackBar}
                     setShowPartyJoinFailSnackBar={setShowPartyJoinFailSnackBar}
      />

      {/*오픈 채팅 모달*/}
      <OpenChatLinkForm showOpenChatLink={showOpenChatLink} setShowOpenChatLink={setShowOpenChatLink}
                        openChatLink={partyData.openChatLink}/>


      <TopCenterSnackBar value={showPartyJoinSuccessSnackBar} setValue={setShowPartyJoinSuccessSnackBar}
                         severity={"success"} content={"파티 참여 메세지 전송 완료!"}/>
      <TopCenterSnackBar value={showPartyJoinDuplicateSnackBar} setValue={setShowPartyJoinDuplicateSnackBar}
                         severity={"warning"} content={"이미 파티 참여 메세지를 전송하였습니다!"}/>
      <TopCenterSnackBar value={showPartyJoinFailSnackBar} setValue={setShowPartyJoinFailSnackBar} severity={"error"}
                         content={"파티 참여 실패"}/>

    </PartyDetailPageContainer>


  );
};

export default PartyDetailPage;