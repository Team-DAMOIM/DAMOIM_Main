import styled from "styled-components";

export const JoinPartyPageContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 50px auto 100px;
  display: block;
`

export const PartyCardContainer = styled.div`
  max-width: 100%;
  margin: 50px auto 50px;
  display: grid;
  grid-template-columns: repeat(4, minmax(330px, 1fr));

  @media screen and (max-width: 1425px) {
    grid-template-columns: repeat(3, minmax(330px, 1fr));
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(330px, 1fr));
  }
  @media screen and (max-width: 690px) {
    grid-template-columns: repeat(1, minmax(330px, 1fr));
  }
`