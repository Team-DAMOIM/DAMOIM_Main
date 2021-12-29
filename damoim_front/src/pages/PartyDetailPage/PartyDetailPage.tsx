import React, { useState } from 'react';
import {useParams} from "react-router-dom";
import { DetailBox, MemberInfoBox, MemberInfoContainer, InfoText, PartyDetailPageContainer, PersonIconLink, SelectedOTTBox, TrimOTTIcon, InfoTextArea, MemberTalkBox, MemberTalkArea } from './partyDetailPageStyles';

// 임시 하드코딩
const userData = {
  "BQ4OjOhN1oR0twqvQuYGoQ8IWQI2": {
    name: "koh1018",
    isHost: true,
    temperature: 42,
    joinPeriod: 6
  },
  "DZWsJpZcyxQYbunQvpK4VK3atBy2": {
    name: "Dan2029",
    isHost: false,
    temperature: 42,
    joinPeriod: 3
  }
}

const partyData = {
  1: {
    startDate: "2022.01.01 ~",
    wishPeriod: 3,
    kakaotalkURL: "https://open.kakao.com/o/sEjXPFMd",
    member1: "안녕하세요. 3개월간 넷플릭스와 디즈니플러스 구독하려고 합니다. 매너있고 연락 잘되시는 분들 연락주세요.",
    member2: "안녕하세요. 잘부탁드립니다.",
    member3: "",
    member4: ""
  }
}


const PartyDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // 밑에 useState 하드코딩한거 수정
  const [selectedOTT, setSelectedOTT] = useState(["netflix", "disneyPlus"]);
  const [memberInfoData, setMemberInfoData] = useState(["BQ4OjOhN1oR0twqvQuYGoQ8IWQI2", "DZWsJpZcyxQYbunQvpK4VK3atBy2", "", ""]);

  return (
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
          {memberInfoData.map(member => {
            return(
              <MemberInfoBox>
                {/* 밑에 이거 하드코딩됨. */}
                <InfoText isBold={true} fontSize='14px' fontColor='black' textAlign='center'>{userData["BQ4OjOhN1oR0twqvQuYGoQ8IWQI2"].isHost ? "파티장" : "X"}</InfoText>
                <PersonIconLink to={'/'}/>
                <InfoText isBold={true} fontSize='18px' fontColor='black' textAlign='center'>{userData["BQ4OjOhN1oR0twqvQuYGoQ8IWQI2"].name}</InfoText>
                <InfoText isBold={true} fontSize='18px' textAlign='center'
                  fontColor={userData["BQ4OjOhN1oR0twqvQuYGoQ8IWQI2"].temperature < 30 ? "gray"
                  : userData["BQ4OjOhN1oR0twqvQuYGoQ8IWQI2"].temperature < 40 ? "blue" 
                  : userData["BQ4OjOhN1oR0twqvQuYGoQ8IWQI2"].temperature < 50 ? "orange" 
                  : "red"}>
                    {userData["BQ4OjOhN1oR0twqvQuYGoQ8IWQI2"].temperature}도
                </InfoText>
                <InfoText isBold={false} fontSize='12px' fontColor='black' textAlign='center'>
                  {userData["BQ4OjOhN1oR0twqvQuYGoQ8IWQI2"].joinPeriod}개월 참여
                </InfoText>
              </MemberInfoBox>
            )
          })}
        </MemberInfoContainer>
        <InfoTextArea>
          <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>시작일(갱신일)</InfoText>
          <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{partyData[1].startDate}</InfoText>
          
          <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>구독희망기간</InfoText>
          <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{partyData[1].wishPeriod}개월</InfoText>
          
          <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>오픈채팅 URL</InfoText>
          <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'><a href={partyData[1].kakaotalkURL}>{partyData[1].kakaotalkURL}</a></InfoText>
        </InfoTextArea>
        <MemberTalkBox>
          <InfoText isBold={true} fontSize='16px' fontColor='black' textAlign='left'>파티원들의 한마디</InfoText>
          <MemberTalkArea>
            <InfoText isBold={true} fontSize='16px' fontColor='black' textAlign='left'>koh1018(파티장)</InfoText>
            <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{partyData[1].member1}</InfoText>
            <br/>
            <InfoText isBold={true} fontSize='16px' fontColor='black' textAlign='left'>Dan2029(파티원1)</InfoText>
            <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{partyData[1].member2}</InfoText>
            <br/>
            <InfoText isBold={true} fontSize='16px' fontColor='black' textAlign='left'></InfoText>
            <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{partyData[1].member3}</InfoText>
            <br/>
            <InfoText isBold={true} fontSize='16px' fontColor='black' textAlign='left'></InfoText>
            <InfoText isBold={false} fontSize='16px' fontColor='black' textAlign='left'>{partyData[1].member4}</InfoText>
          </MemberTalkArea>
        </MemberTalkBox>
      </DetailBox>
    </PartyDetailPageContainer>
  );
};

export default PartyDetailPage;