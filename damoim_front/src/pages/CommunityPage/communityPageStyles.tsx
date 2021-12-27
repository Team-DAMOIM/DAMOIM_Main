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
  text-align: start;
  margin-left: 4vw;
  display: flex;
  button:first-child{
    margin-right: 10px;
  }
`
export const CommunityRightButtonContainer = styled.div`
  text-align: end;
  margin-right: 4vw;
  button:first-child{
    margin-right: 10px;
  }
`

