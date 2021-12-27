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
  div:first-child{
    margin-right: 10px;
  }
`
export const CommunityRightButtonContainer = styled.div`
  margin-right: 4vw;
  button:first-child{
    margin-right: 10px;
  }
  display: flex;
  flex-direction: column;
  align-items: end;
`

export const CommunityRightOnlyButtonContainer = styled.div`
  display: flex;
`


export const CommunitySearchWordContainer= styled.div`
  margin-top: 10px;
  text-align: end;
`

