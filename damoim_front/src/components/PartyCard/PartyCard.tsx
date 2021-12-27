import React from 'react';
import { ExplainText, HeaderTextArea, IconImg, IncludedOTTs, OTTIcon, OTTIconCover, PartyCardBody, PartyCardContainer, PartyCardHeader, PartyCardInner, PersonIcon, PersonIconArea, TemperatureText } from './partyCardStyles';

interface PartyCardProps {
  OTTArray: string[];
  headerText: string;
  temperature: number;
}

const PartyCard = (props: PartyCardProps) => {
  
  const { OTTArray, headerText, temperature } = props;
  let textColor = "blue";

  if(temperature < 30) {
    textColor = "gray";
  } else if (40 <= temperature && temperature < 50) {
    textColor = "orange";
  } else if (50 <= temperature) {
    textColor = "red";
  }

  return (
    <PartyCardContainer>
      <PartyCardInner>
        <PartyCardHeader>
          <HeaderTextArea>{ headerText }</HeaderTextArea>
          <IncludedOTTs>
            {OTTArray.map(OTT => {
              return(
                <OTTIconCover>
                  <OTTIcon>
                    {/* 이미지 경로 수정필요 */}
                    <IconImg src={"../../assets/images/OTTIcons/netflixIcon.png"}/>
                  </OTTIcon>
                </OTTIconCover>
              )
            })}
          </IncludedOTTs>
        </PartyCardHeader>
        <PartyCardBody>
          <PersonIconArea>
            {[0,1,2,3].map(() => {
              return(
                <PersonIcon />
              )
            })}
          </PersonIconArea>
          <ExplainText>평균온도</ExplainText>
          <TemperatureText style={{color: textColor}}>{temperature}도</TemperatureText>
        </PartyCardBody>
      </PartyCardInner>
    </PartyCardContainer>
  );
};

export default PartyCard;