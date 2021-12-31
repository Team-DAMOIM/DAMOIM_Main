import { Link } from "react-router-dom";
import styled from "styled-components";

export const PartyDetailPageContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 50px auto 3vh;
  padding-bottom: 50px;
`;

export const DetailBox = styled.div`
  max-width: 80%;
  margin: 50px auto 0;
  height: 1000px;
  border: 3px solid gray;
  border-radius: 20px;
  box-shadow: rgb(0 0 0 / 12%) 0px 3px 6px, rgb(0 0 0 / 24%) 0px 2px 5px;
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
`

export const MemberInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
`

interface MemberInfoTextProps{
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
  background: url(/images/personIcon.png) no-repeat;
  background-size : cover;
  margin: auto;
`

export const InfoTextArea = styled.div`
  width: 80%;
  height: 140px;
  margin: 80px auto 40px;
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
  align-content: space-between;
`

export const MemberTalkBox = styled.div`
  width: 80%;
  margin: auto;
`

export const MemberTalkArea = styled.div`
  width: 100%;
  padding: 20px 10px;
  margin-top: 10px;
  border-radius: 20px;
  box-shadow: rgb(221 221 221) 0px 0px 10px;
`