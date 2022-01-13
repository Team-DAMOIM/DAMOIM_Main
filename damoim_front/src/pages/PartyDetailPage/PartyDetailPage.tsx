import {doc, getDoc} from 'firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import { db } from '../../firebase-config';
import { DetailBox, MemberInfoBox, MemberInfoBoxFlexStart, MemberInfoContainer, InfoText, PartyDetailPageContainer, PersonIconLink, PersonIconNotLink, SelectedOTTBox, TrimOTTIcon, InfoTextArea, MemberTalkBox, MemberTalkArea, LoadingArea } from './partyDetailPageStyles';
import { CircularProgress } from "@material-ui/core";
import {partyTypes, userInfoTypes} from "../../utils/types";
import moment from "moment";
import {AuthContext} from "../../context/AuthContext";


const PartyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const user = useContext(AuthContext);

  // 밑에 useState 하드코딩한거 수정
  const [partyData, setPartyData] = useState<partyTypes | null>();
  const [selectedOTT, setSelectedOTT] = useState<string[]>([]);
  const [memberUIDs, setMemberUIDs] = useState<string[]>([]);
  const [memberData, setMemberData] = useState<userInfoTypes[]>([]);

  const getPartyData = async (partyID: string) => {
    const docRef = doc(db, "partys", partyID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setPartyData({
        id: partyID,
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
        uid : docSnap.data().uid,
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

  return (
    partyData && (selectedOTT.length !== 0)   // partyData 받아오고 선택한 OTT 데이터 받아오면
    && (memberUIDs.length !== 0) && (memberData.length === memberUIDs.length) ? ( // 여기중요! memberUID목록을 받아오면 (length가 0이 아닐 때) 해당 member수와 받아온 memberData 수가 일치하는지 확인
      <PartyDetailPageContainer>
        <DetailBox>
          <SelectedOTTBox>
            {selectedOTT.map(OTT => {
              return (
                <TrimOTTIcon>
                  <img src={`/images/OTTIcons/${OTT}Icon.png`} />
                </TrimOTTIcon>
              )
            })}
          </SelectedOTTBox>
          <MemberInfoContainer>
            {[0, 1, 2, 3].map(idx => {
              if (idx < memberData.length) {
                return (
                  <MemberInfoBox>
                    <InfoText isBold={true} fontSize='14px' fontColor='black' textAlign='center'>{memberData[idx].uid === partyData?.hostUID ? "파티장" : "파티원"}</InfoText>
                    {/* 아래 삼항연산자 설명 : 만약 자기 프로필을 클릭하면 otherUserPage로 가는게 아니라 userPage(마이페이지)로 갈 수 있게 처리 */}
                    <PersonIconLink to={user ? (memberData[idx].uid === user.uid) ? `/userPage/${user.uid}` : `/otherUserPage/${memberData[idx].uid}` : `/otherUserPage/${memberData[idx].uid}`}/>
                    <InfoText isBold={true} fontSize='18px' fontColor='black' textAlign='center'>{memberData[idx].nickName}</InfoText>
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
                  <MemberInfoBoxFlexStart>
                    <InfoText isBold={true} fontSize='14px' fontColor='black' textAlign='center'>X</InfoText>
                    <PersonIconNotLink/>
                  </MemberInfoBoxFlexStart>
                )
              }
            })}
          </MemberInfoContainer>
          <InfoTextArea>
            <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>시작일(갱신일)</InfoText>
            <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{moment(partyData.startDate.toDate()).format('YYYY년 MM월 DD일 ~')}</InfoText>

            <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>구독희망기간</InfoText>
            <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{partyData.wishPeriod}개월</InfoText>

            <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>오픈채팅 URL</InfoText>
            <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'><a href={partyData.openChatLink}>{partyData.openChatLink}</a></InfoText>
          </InfoTextArea>
          <MemberTalkBox>
            <InfoText isBold={true} fontSize='16px' fontColor='black' textAlign='left'>파티원들의 한마디</InfoText>
            <MemberTalkArea>
              <InfoText isBold={true} fontSize='16px' fontColor='black' textAlign='left'>{memberData[0].nickName}(파티장)</InfoText>
              <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left' style={{marginTop: '10px'}}>{partyData.memberTalk}</InfoText>
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
        </DetailBox>
      </PartyDetailPageContainer>
    ) : (
      <LoadingArea>
        <CircularProgress />
      </LoadingArea>
    )
  );
};

export default PartyDetailPage;