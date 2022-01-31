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
  PersonIcon,
  PersonIconArea,
  TemperatureText
} from './partyCardStyles';
import useTemperatureColor from "../../hooks/useTemperatureColor";

interface PartyCardProps {
  id: string;
  OTTsNameArray: string[];
  headerText: string;
  avgTemperature: number;
  memberNum: number;
}

const PartyCard = ({id, OTTsNameArray, headerText, avgTemperature, memberNum}: PartyCardProps) => {


  const textColor = useTemperatureColor(avgTemperature);

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
                return (
                  <PersonIcon key={idx} url={idx <= (memberNum - 1) ? "personIconFilled" : "personIcon"}/>
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