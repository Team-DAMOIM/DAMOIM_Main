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

interface PartyCardProps {
    id: string;
    OTTsNameArray: string[];
    headerText: string;
    avgTemperature: number;
    memberNum: number;
}

const PartyCard = ({id, OTTsNameArray, headerText, avgTemperature, memberNum}: PartyCardProps) => {

    let textColor = "blue";

    if (avgTemperature < 30) {
        textColor = "gray";
    } else if (40 <= avgTemperature && avgTemperature < 50) {
        textColor = "orange";
    } else if (50 <= avgTemperature) {
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
                            {[0, 1, 2, 3].map(idx => {
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