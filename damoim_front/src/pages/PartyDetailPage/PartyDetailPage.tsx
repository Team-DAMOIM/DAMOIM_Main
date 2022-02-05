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
  JoinButtonContainer, StartButtonContainer
} from './partyDetailPageStyles';
import {partyAcceptTypes, partyTypes, userInfoTypes} from "../../utils/types";
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
import {partyAcceptsCollectionRef, partysCollectionRef} from "../../firestoreRef/ref";
import {getTemperatureColor} from "../../utils/functions";
import StartPartyForm from "./StartPartyForm";
import LeavePartyForm from "./LeavePartyForm";

const PartyDetailPage = () => {
  const {id} = useParams<{ id: string }>();
  const user = useContext(AuthContext);

  const [partyData, setPartyData] = useState<partyTypes | null>();
  const [memberData, setMemberData] = useState<userInfoTypes[]>([]);
  const [joinPartyOpen, setJoinPartyOpen] = useState<boolean>(false)
  const [showOpenChatLink, setShowOpenChatLink] = useState<boolean>(false)
  const [startPartyOpen, setStartPartyOpen] = useState<boolean>(false);
  const [leavePartyOpen, setLeavePartyOpen] = useState<boolean>(false);
  const [showPartyJoinSuccessSnackBar, setShowPartyJoinSuccessSnackBar] = useState<boolean>(false);
  const [showPartyJoinDuplicateSnackBar, setShowPartyJoinDuplicateSnackBar] = useState<boolean>(false);
  const [showPartyJoinFailSnackBar, setShowPartyJoinFailSnackBar] = useState<boolean>(false);
  const [partyAcceptsLength, setPartyAcceptsLength] = useState<number>(0);
  const [alreadySubmit, setAlreadySubmit] = useState<boolean>(false);
  const [partyAcceptData, setPartyAcceptData] = useState<partyAcceptTypes | null>();
  const [isNotApply, setIsNotApply] = useState<boolean>(false);
  // const [alreadyStart, setAlreadyStart] = useState<boolean>(false);

  const getUserData = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setMemberData(memberData => [...memberData, {...docSnap.data()} as userInfoTypes]);
    } else {
      console.log("No such document!");
    }
  }
  // 초기 partyDetail 에 대한정보
  useEffect(() => {
    const getPartyData = async (partyId: string) => {
      const docRef = doc(db, "partys", partyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPartyData({id: docSnap.id, ...docSnap.data()} as partyTypes)
        for (let i = 0; i < docSnap.data().memberUIDs.length; i++) {
          // docSnap.data().memberUIDs 말고 memberUIDs를 사용하면 useState도 비동기이기 때문에 undefined가 들어간다.
          await getUserData(docSnap.data().memberUIDs[i]);
        }
      } else {
        console.log("No such document!");
      }
    }

    getPartyData(id)
    return () => {
      setMemberData([])
    }
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
    const partyAlreadyAccept = async () => {
      const partyAlreadyAcceptQuery = await query(partyAcceptsCollectionRef, where("partyId", "==", id), where("applicant", "==", user?.uid))
      const data = await getDocs(partyAlreadyAcceptQuery);
      if (data.docs.map(doc => doc.data())[0]) setAlreadySubmit(true)
    }
    if (user) {
      partyAlreadyAccept();
    }
  }, [])

  // // 이미 파티를 시작했는지 가져오기
  // useEffect(() => {
  //   if (partyData
  //     && partyData.state === "active") {
  //     setAlreadyStart(true);
  //   }
  // }, [partyData])

  // 가입한 모든 OTT 불러오기
  const [userSubscribeOTTs, setUserSubscribeOTTs] = useState<string[]>();
  useEffect(() => {
    const getMySubscribeOTTs = async () => {
      if (user) {
        const q = await query(partysCollectionRef, where("memberUIDs", "array-contains", user.uid));
        const data = await getDocs(q);

        let resultArr: string[] = [];

        if (data.docs.length !== 0) {
          data.docs.map(doc => {
            // resultArr.concat(doc.data().selectedOTTs)
            resultArr = [...resultArr, ...doc.data().selectedOTTs];
          });

          // 배열의 중복값 제거
          const set = new Set(resultArr);
          resultArr = [];
          resultArr = [...set];
        }

        setUserSubscribeOTTs(resultArr);
      }
    }
    getMySubscribeOTTs();
  }, [])

  // 파티원이 페이지를 보는 경우 partyAccepts 컬랙션에서 파티원의 신청 정보를 불러옴
  useEffect(() => {
    if (user && partyData && (user.uid !== partyData.hostUID)) {
      const getPartyAcceptData = async () => {
        const q = await query(partyAcceptsCollectionRef, where('applicant', "==", user.uid), where('partyId', "==", partyData.id))
        const data = await getDocs(q);

        if (data.docs.length !== 0) {
          setPartyAcceptData({...data.docs[0].data(), id: data.docs[0].id} as partyAcceptTypes);
        } else {
          // 해당 파티에 신청한 적이 없는 경우
          setIsNotApply(true);
        }
      }

      getPartyAcceptData();
    }
  }, [user, partyData])

  if (!(partyData    // partyData 받아오고 선택한 OTT 데이터 받아오면
    && (partyData.memberUIDs.length !== 0) && (memberData.length >= partyData.memberUIDs.length))) {  // 여기중요! memberUID목록을 받아오면 (length가 0이 아닐 때) 해당 member수와 받아온 memberData 수가 일치하는지 확인
    return <LoadingCircularProgress/>
  }

  // 파티 참여 신청 버튼을 눌렀을 때 실행되는 함수
  const joinPartySubmit = () => {
    // 이미 구독(파티참여)한 OTT가 있는지 검사
    let duplicateOTTs: string[] = []; // 선택한 OTT와 이미 가입한 OTT(중복된 OTT들) 배열
    partyData.selectedOTTs.map(ott => {
      if (userSubscribeOTTs?.includes(ott)) {
        duplicateOTTs.push(ott)
      }
    })

    if (duplicateOTTs.length > 0) {
      alert(`${duplicateOTTs.toString()}는 이미 구독(파티참여)한 OTT입니다. 동일한 OTT로 여러 개의 파티에 가입할 수 없습니다!`)
    } else {
      setJoinPartyOpen(true);
    }
  }

  return (
    <PartyDetailPageContainer>
      <DetailBox>
        <SelectedOTTBox>
          {partyData.selectedOTTs.map(OTT => {
            return (
              <TrimOTTIcon key={OTT}>
                <img src={`/images/OTTIcons/${OTT}Icon.png`}/>
              </TrimOTTIcon>
            )
          })}
        </SelectedOTTBox>
        <MemberInfoContainer>
          {[...Array(4)].map((item, idx) => {
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
                            fontColor={getTemperatureColor(memberData[idx].temperature)}
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
        </InfoTextArea>
        <MemberTalkBox>
          <InfoText isBold={true} fontSize='16px' fontColor='black' textAlign='left'>파티원들의 한마디</InfoText>
          <MemberTalkArea>
            <InfoText isBold={true} fontSize='16px' fontColor='black'
                      textAlign='left'>{memberData[0].nickName}(파티장)</InfoText>
            <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'
                      style={{marginTop: '10px'}}>{partyData.memberTalk}</InfoText>
            <br/>
          </MemberTalkArea>
        </MemberTalkBox>
        {
          // 파티원이 페이지를 보는 경우
          user?.uid !== partyData.hostUID && (partyAcceptData || isNotApply) &&
          <JoinButtonContainer>
            {
              isNotApply ? (
                <Button disabled={partyData.memberUIDs.length === 4 || partyData.state === "active"} onClick={joinPartySubmit} variant={"outlined"}>파티 참여 신청</Button>
              ) : (
                <>
                  <Button onClick={() => {
                    setLeavePartyOpen(true);
                  }} variant={"outlined"}>{partyAcceptData?.state === "nonActive" ? "참여 신청 취소" : "탈퇴 요청"}</Button>
                  <Button onClick={() => {
                    setShowOpenChatLink(true);
                  }} variant={"outlined"} style={{marginLeft: '10px'}}>오픈채팅 링크확인</Button>
                </>
              )
            }
            <span>현재 {partyAcceptsLength}명이 이 파티에 관심있습니다</span>
          </JoinButtonContainer>
        }
        {
          // 파티장이 페이지를 보는 경우
          user?.uid === partyData.hostUID  &&
          <>
            <PartyAcceptTable partyId={partyData.id} getUserData={getUserData} selectedOTTs={partyData.selectedOTTs}/>
            <StartButtonContainer>
              <Button disabled={partyData.state === "active"} onClick={() => {
                setStartPartyOpen(true);
              }} variant={"outlined"}>파티 시작</Button>
            </StartButtonContainer>
          </>
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

      {/*파티 신청취소 or 탈퇴 요청 모달*/}
      {
        user && partyAcceptData &&
        <LeavePartyForm leavePartyOpen={leavePartyOpen} setLeavePartyOpen={setLeavePartyOpen} acceptState={partyAcceptData.state} partyState={partyData.state} partyAcceptID={partyAcceptData.id} partyID={partyData.id} memberUIDs={partyData.memberUIDs} userUID={user.uid}/>
      }

      {/*파티 시작 모달*/}
      <StartPartyForm startPartyOpen={startPartyOpen} setStartPartyOpen={setStartPartyOpen} id={partyData.id}/>

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