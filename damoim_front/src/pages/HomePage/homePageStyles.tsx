import styled from "styled-components";

export const HomePageContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 50px auto 100px;
`

// export const MainBanner = styled.div`
//   max-width: 1400px;
//   width: 100%;
//   height: 440px;
//   margin: auto;
//   display: block;
//   background-color: pink;
//   text-align: center;
//   line-height: 440px;
//   font: bold 50px "NanumGothic", sans-serif;
// `

export const PartyCardContainer = styled.div`
  max-width: 100%;
  margin: 50px auto 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(330px, 1fr));
`