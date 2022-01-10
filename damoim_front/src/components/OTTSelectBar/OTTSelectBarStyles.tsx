import styled, {keyframes} from "styled-components";


const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const OTTSelectBarContainer = styled.div`
  display: flex;
  font-size: 50px;
  margin-top: 20px;
  flex-direction: column;

  button {
    margin: 0 auto;
    animation-duration: 0.75s;
    animation-timing-function: ease-in-out;
    animation-name: ${fadeIn};
    animation-fill-mode: forwards;
  }
`

export const OTTIconsContainer = styled.div`
  margin: 25px auto 20px;
  padding: 5px 10px;
  width: 100%;
  height: 75%;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 20px;
  overflow: auto;
  max-width: 1400px;
  box-shadow: rgb(221 221 221) 0px 0px 10px;
`