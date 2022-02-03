import {Link} from "react-router-dom";
import styled from "styled-components";
import {Button} from "@mui/material";

export const PartyDetailPageContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 50px auto 3vh;
  padding-bottom: 50px;
`;

export const DetailBox = styled.div`
  max-width: 80%;
  margin: 50px auto 0;
  padding-bottom: 3vh;
  height: 100%;
  border: 3px solid gray;
  border-radius: 20px;
  box-shadow: rgb(0 0 0 / 12%) 0px 3px 6px, rgb(0 0 0 / 24%) 0px 2px 5px;


  @media screen and (max-width: 768px) {
    max-width: 90%;
  }

  @media screen and (max-width: 480px) {
    max-width: 95%;
  }
`

export const SelectedOTTBox = styled.div`
  display: flex;
  margin: 25px auto 50px;
  padding: 5px 10px;
  width: 100%;
  height: 100px;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 20px;
  overflow: auto;
  max-width: 90%;
  box-shadow: rgb(221 221 221) 0px 0px 10px;
`

export const TrimOTTIcon = styled.div`
  display: flex;
  align-content: center;
  justify-content: flex-start;

  img {
    border-radius: 10px;
    width: 70px;
    height: 70px;
    margin: 10px 15px;
  }
`

export const MemberInfoContainer = styled.div`
  margin: auto;
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 80%;

  @media screen and (max-width: 480px) {
    width: 100%;
  }
`

export const MemberInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
`

export const MemberInfoBoxFlexStart = styled.div`
  display: flex;
  flex-direction: column;
`

interface MemberInfoTextProps {
  isBold: boolean;
  fontSize: string;
  fontColor: string;
  textAlign: string;
}

export const InfoText = styled.p<MemberInfoTextProps>`
  font-weight: ${props => props.isBold ? "bold" : "normal"};
  font-size: ${props => props.fontSize};
  color: ${props => props.fontColor};
  text-align: ${props => props.textAlign};
`

export const PersonIconLink = styled(Link)`
  display: block;
  width: 70px;
  height: 70px;
  background: url(/images/personIconFilled.png) no-repeat;
  background-size: cover;
  transform: scale(1.15);
  margin: auto;
  @media screen and (max-width: 390px) {
    width: 60px;
    height: 60px;
  }
`

export const PersonIconNotLink = styled.div`
  display: block;
  width: 70px;
  height: 70px;
  background: url(/images/personIcon.png) no-repeat;
  background-size: cover;
  @media screen and (max-width: 390px) {
    width: 60px;
    height: 60px;
  }
`

export const InfoTextArea = styled.div`
  width: 80%;
  margin: 0 auto;
  margin-top: 10vh;

  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-gap: 50px;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, auto);
    grid-gap: 15px;
  }
`

export const MemberTalkBox = styled.div`
  width: 80%;
  margin: 80px auto 0;
`

export const MemberTalkArea = styled.div`
  width: 100%;
  padding: 30px;
  margin-top: 10px;
  border-radius: 20px;
  box-shadow: rgb(221 221 221) 0px 0px 10px;
`


export const JoinButtonContainer = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 3vh;
  position: relative;
  
  span{
    position: absolute;
    right: 80px;
    top: 50%;
    transform: translate3d(0,-50%,0);
  }
`


export const PartyAcceptTableContainer = styled.div`
  width: 80%;

  margin: 80px auto 0;

`

export const StartButtonContainer = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 7vh;
  position: relative;
`