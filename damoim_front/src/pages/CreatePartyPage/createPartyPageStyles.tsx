import styled from "styled-components";
import HalfTextArea from "../../components/HalfTextArea/HalfTextArea";

export const CreatePartyPageContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 50px auto 3vh;
  padding-bottom: 50px;
`

export const CustomHalfTextArea = styled(HalfTextArea)`
  margin-left: 5vw;
`

export const InfoInputBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 90%;
  margin: 50px auto 0;
  height: 100%;
  border: 3px solid gray;
  border-radius: 20px;
  box-shadow: rgb(0 0 0 / 12%) 0px 3px 6px, rgb(0 0 0 / 24%) 0px 2px 5px;
  padding: 30px 50px 100px;
  row-gap: 50px;
  @media screen and (max-width: 768px) {
    padding: 1vh;
  }
`

export const RawFlexInfoCont = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`

export const ColFlexInfoCont = styled.div`
  display: flex;
  flex-direction: column;
`

export const CreatePartyBtn = styled.div`
  width: 200px;
  height: 50px;
  border-radius: 20px;
  background: #fff;
  padding: 10px 22px;
  color: black;
  border: solid 1px black;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin: 100px auto 50px;
  text-align: center;
  line-height: 30px;

  &:hover {
    transform: scale(1.03);
  }
`
export const LoadingArea = styled.div`
  margin: 400px auto 300px;
  width: 100%;
  text-align: center;
`;