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
import {getTemperatureColor} from "../../utils/functions";

interface PartyCardProps {
  id: string;
  OTTsNameArray: string[];
  headerText: string;
  avgTemperature: number;
  memberNum: number;
}

const PartyCard = ({id, OTTsNameArray, headerText, avgTemperature, memberNum}: PartyCardProps) => {


  const textColor = getTemperatureColor(avgTemperature)

  return (
    <PartyCardContainer>
      <PartyDetailLink to={`/partyDetail/${id}`}>
        <PartyCardInner>
          <PartyCardHeader full={memberNum === 4}>
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
            <TemperatureText style={{color: textColor}}>{avgTemperature}도</TemperatureText>
          </PartyCardBody>
        </PartyCardInner>
      </PartyDetailLink>
    </PartyCardContainer>
  );
};

export default PartyCard;