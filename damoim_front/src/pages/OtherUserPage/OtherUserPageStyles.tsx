import styled from "styled-components";

export const OtherUserPageContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 50px auto 3vh;
  padding-bottom: 50px;
`

export const OtherUserInfoBox = styled.div`
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

export const MainInfoCard = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1vw;
  border-radius: 5px;
  box-shadow: rgb(0 0 0 / 12%) 0px 3px 6px, rgb(0 0 0 / 24%) 0px 2px 5px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    button{
      margin-top: 2vh;
    }
  }
`

export const UserImageWithInfo = styled.div`
  display: flex;
  img{
    width:60px;
    height: 60px;
    border-radius: 50%;
    box-shadow: rgb(0 0 0 / 12%) 0px 3px 6px, rgb(0 0 0 / 24%) 0px 2px 5px;

    margin: auto;
  }
`
export const UserNameWithEmail = styled.div`
  
  display: flex;
  flex-direction: column;
  margin-left: 2vw;
  
  h4{
    font-weight: bold;
  }
  span{
    color: #555;
  }
`

export const AdditionalInfoCard = styled.div`
  margin-top: 10vh;
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-gap: 50px;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, auto);
    grid-gap: 15px;
  }
`

export const OtherUserHistorySection = styled.div`
  margin-top: 5vh;
`

export const LoadingArea = styled.div`
  margin: 400px auto 300px;
  width: 100%;
  text-align: center;
`

export const OtherUserHistoryContainer = styled.div`
  border-radius: 5px;
  box-shadow: rgb(0 0 0 / 12%) 0px 3px 6px, rgb(0 0 0 / 24%) 0px 2px 5px;
`