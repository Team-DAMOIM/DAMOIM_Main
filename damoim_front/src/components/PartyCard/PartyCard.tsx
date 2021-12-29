import React from 'react';
import { BgPerson, ExplainText, HeaderTextArea, IconImg, IncludedOTTs, OTTIcon, OTTIconCover, PartyCardBody, PartyCardContainer, PartyCardHeader, PartyCardInner, PartyDetailLink, PersonIcon, PersonIconArea, TemperatureText } from './partyCardStyles';
import netflixIcon from '../../assets/images/OTTIcons/netflixIcon.png';

interface PartyCardProps {
  id: string;
  OTTsNameArray: string[];
  headerText: string;
  temperature: number;
  memberNum: number;
}

const PartyCard = ({ id, OTTsNameArray, headerText, temperature, memberNum }: PartyCardProps) => {
  
  let textColor = "blue";

  if(temperature < 30) {
    textColor = "gray";
  } else if (40 <= temperature && temperature < 50) {
    textColor = "orange";
  } else if (50 <= temperature) {
    textColor = "red";
  }

  let personWidth = ["0", "0", "0", "0"];

  if (memberNum < 2) {  // 멤버수 1명
    personWidth = ["100", "0", "0", "0"];
  } else if (memberNum < 3) { // 멤버수 2명
    personWidth = ["100", "100", "0", "0"];
  } else if (memberNum < 4) { // 멤버수 3명
    personWidth = ["100", "100", "100", "0"];
  } else if (memberNum < 5) { // 멤버수 4명
    personWidth = ["100", "100", "100", "100"];
  }

  return (
    <PartyCardContainer>
      <PartyDetailLink to={`/partyDetail/${id}`}>
        <PartyCardInner>
          <PartyCardHeader>
            <HeaderTextArea>{ headerText }</HeaderTextArea>
            <IncludedOTTs>
              {OTTsNameArray.map(OTT => {
                return(
                  <OTTIconCover>
                    <OTTIcon>
                      <IconImg src={`/images/OTTIcons/${OTT}Icon.png`}/>
                    </OTTIcon>
                  </OTTIconCover>
                )
              })}
            </IncludedOTTs>
          </PartyCardHeader>
          <PartyCardBody>
            <PersonIconArea>
              {[0,1,2,3].map(idx => {
                return(
                  <PersonIcon>
                    <BgPerson
                      style={{width: `${personWidth[idx]}%`}}
                    />
                  </PersonIcon>
                )
              })}
            </PersonIconArea>
            <ExplainText>평균온도</ExplainText>
            <TemperatureText style={{color: textColor}}>{temperature}도</TemperatureText>
          </PartyCardBody>
        </PartyCardInner>
      </PartyDetailLink>
    </PartyCardContainer>
  );
};

export default PartyCard;