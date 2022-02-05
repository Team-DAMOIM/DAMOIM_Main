import React from 'react';
import {
  ExplainText,
  HeaderTextArea,
  IconImg,
  IncludedOTTs,
  OTTIcon,
  OTTIconCover,
  PartyCardBody,
  PartyCardContainer,
  PartyCardHeader,
  PartyCardInner,
  PartyDetailLink,
  // PersonIcon,
  PersonIconArea, PersonIconImg,
  TemperatureText
} from './partyCardStyles';
import {getPartyCardHeaderColor, getPartyCardHeaderText, getTemperatureColor} from "../../utils/functions";

interface PartyCardProps {
  id: string;
  OTTsNameArray: string[];
  avgTemperature: number;
  memberNum: number;
  state: string;
}

const PartyCard = ({id, OTTsNameArray, avgTemperature, memberNum, state}: PartyCardProps) => {

  const headerText = getPartyCardHeaderText(memberNum, state);
  const headerBackColor = getPartyCardHeaderColor(headerText);
  const temperatureTextColor = getTemperatureColor(avgTemperature);

  return (
    <PartyCardContainer>
      <PartyDetailLink to={`/partyDetail/${id}`}>
        <PartyCardInner>
          <PartyCardHeader backColor={headerBackColor}>
            <HeaderTextArea>{headerText}</HeaderTextArea>
            <IncludedOTTs>
              {OTTsNameArray.map(OTT => {
                return (
                  <OTTIconCover key={OTT}>
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
              {[...Array(4)].map((item,idx) => {

                let iconType: string;
                if (idx <= (memberNum - 1)) {
                  iconType = "personIconFilled"
                } else {
                  iconType = "personIcon"
                }

                return (
                  // <PersonIcon key={idx} url={idx <= (memberNum - 1) ? "personIconFilled" : "personIcon"}/>
                  <PersonIconImg key={idx} src={`images/${iconType}.png`} url={iconType}/>
                )
              })}
            </PersonIconArea>
            <ExplainText>평균온도</ExplainText>
            <TemperatureText style={{color: temperatureTextColor}}>{avgTemperature}도</TemperatureText>
          </PartyCardBody>
        </PartyCardInner>
      </PartyDetailLink>
    </PartyCardContainer>
  );
};

export default PartyCard;