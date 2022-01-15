import {Link} from "react-router-dom";
import styled from "styled-components";

export const PartyCardContainer = styled.div`
  cursor: pointer;
  z-index: 1;
  position: relative;
  background-color: white;
  width: 330px;
  height: 330px;
  max-width: 350px;
  margin: 30px auto;
  border-radius: 20px;
  box-shadow: rgb(0 0 0 / 12%) 0px 3px 6px, rgb(0 0 0 / 24%) 0px 2px 5px;
  transition: all 0.2s linear 0s;

  :hover {
    transform: scale(1.03);
  }
`

export const PartyDetailLink = styled(Link)`

`

export const PartyCardInner = styled.div`
  border-radius: 21px;
  margin: auto;
  position: relative;
  height: 100%;
  width: 100%;
`

export const PartyCardHeader = styled.div`
  position: relative;
  width: 100%;
  height: 55px;
  border-radius: 21px 21px 0px 0px;
  background-color: rgb(110 116 120);
`

export const HeaderTextArea = styled.div`
  width: 100%;
  height: 100%;
  text-align: right;
  font: 25px "NanumGothic", sans-serif;
  color: white;
  padding: 10px 30px 0 0;
`

export const IncludedOTTs = styled.div`
  margin: auto;
  width: 80%;
  height: 100%;
  display: flex;
  position: relative;
  z-index: 10;
`

export const OTTIconCover = styled.div`
  margin: 4% 0px 0px -1%;
  width: 20%;
  height: 100%;
`

export const OTTIcon = styled.div`
  margin: -33px 0px;
  width: 80%;
  height: 80%;
  background: rgb(255, 255, 255);
  display: flex;
  border-radius: 100%;
  box-shadow: rgb(204 204 204) 0px 0px 2px;
  border: none;
`

export const IconImg = styled.img`
  width: 100%;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 100%;
`

export const PartyCardBody = styled.div`
  position: relative;
  margin: 25px 10px;
  padding: 5px;
  height: 60%;
`

export const PersonIconArea = styled.div`
  margin-top: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export const PersonIcon = styled.span<{ url: string }>`
  display: inline-block;
  width: 70px;
  height: 70px;
  transform: ${props => props.url === "personIconFilled" ? 'scale(1.15)' : 'scale(1.0)'};
  z-index: 100;
  position: relative;

  background: ${props => `url(images/${props.url}.png)`} no-repeat;
  background-size: cover;
  // :after {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  //   background: ${props => `url(images/${props.url}.png)`} no-repeat;
  //   background-size: cover;
  // }
`
//
// export const BgPerson = styled.span`
//   position: absolute;
//   top: 0;
//   bottom: 0;
//   left: 0;
//   display: block;
//   background: #1874D0;
// `

export const ExplainText = styled.div`
  margin-top: 40px;
  text-align: right;
  color: black;
  font: 20px "NanumGothic", sans-serif;
`

export const TemperatureText = styled.div`
  text-align: right;
  font: bold 35px "NanumGothic", sans-serif;
  color: blue;
`
