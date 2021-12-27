// styled-component 작업
// export

import styled from "styled-components";

export const CommunityPageContainer = styled.div`
  width: 100%;
`;

export const CommunityButtonContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 30px;
`

export const CommunityLeftButtonContainer = styled.div`
  width: 40%;
  text-align: start;
  margin-left: 4vw;
  display: flex;

  div:first-child {
    margin-right: 10px;
  }


  @media screen and (max-width: 1096px) {
    width: 60%;
  }

  @media screen and (max-width: 730px) {
    width: 80%;
  }

  @media screen and (max-width: 480px) {
    flex-direction: column;
    div:first-child {
      margin-bottom: 10px;
    }
  }

`
export const CommunityRightButtonContainer = styled.div`
  margin-right: 4vw;

  button:first-child {
    margin-right: 10px;
  }

  display: flex;
  flex-direction: column;
  align-items: end;
`

export const CommunityRightOnlyButtonContainer = styled.div`
  display: flex;
  a{
    text-decoration: none;
  }
  @media screen and (max-width: 480px) {
    flex-direction: column;
    button:first-child {
      margin-bottom: 25px;
    }
    button{
      font-size: 1.10rem;
    }
  }
`


export const CommunitySearchWordContainer = styled.div`
  margin-top: 10px;
  text-align: end;
`

export const CommunityTableContainer = styled.div`
  margin: 4vw;
`

