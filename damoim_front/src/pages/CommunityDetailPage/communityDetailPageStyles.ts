import styled from "styled-components";

export const CommunityDetailPageContainer = styled.div`
  margin: 4vw;
  padding: 4vw;
  box-shadow: rgb(210 210 210) 20px 20px 20px 20px;
  border-radius: 20px;
  height: 100%;
  min-height: 90vh;
  position: relative;
  @media screen and (max-width: 480px) {
    padding: 2vw;
  }

  h2 {
    margin-top: 1vh;
  }

  .MuiCardActions-spacing {
    justify-content: flex-end;
  }

  .modify-button-container {
    position: absolute;
    top: 20px;
    right: 20px;
    button{
      margin: 0 5px;
    }
  }
`

export const UserWithDetailContainer = styled.div`
  margin: 2vh 0;

  display: flex;
  justify-content: end;
  @media screen and (max-width: 480px) {
    flex-direction: column;
  }
`

export const CommunityDetailPageIconContainer = styled.div`
  margin-left: 20px;
`