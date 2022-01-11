import styled from "styled-components";

export const FooterContainer = styled.div`
  background: rgb(255, 255, 255);
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 3%, rgba(160, 194, 228, 1) 49%);
  position: relative;
  height: 500px;

  .custom-shape-divider-top-1641383310 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
  }

  .custom-shape-divider-top-1641383310 svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 150px;
  }

  .custom-shape-divider-top-1641383310 .shape-fill {
    fill: #FFFFFF;
  }

  h1 {
    font-size: 7rem;
    position: absolute;
    font-weight: bold;
    top:150px;
    left: 50px;
    color: white;
    opacity: 0.3;
  }

  @media screen and (max-width: 768px) {
    h1{
      font-size: 5rem;
    }
  }
  @media screen and (max-width: 480px) {
    h1{
      font-size: 3rem;
    }
  }
`


export const FooterContentContainer = styled.div`
  position: absolute;
  top:350px;
  left: 60px;
  color: black;
  font-weight: bold;
  @media screen and (max-width: 480px) {
    left:50px;
  }
`

export const FooterLinkContentContainer = styled.div`
  width: 230px;
  position: absolute;
  top: 400px;
  left: 60px;
  display: flex;
  justify-content: space-between;
  font-weight: bold;

  a {
    color: black;

    &:hover {
      color: #3b3b3b
    }
  }

  @media screen and (max-width: 480px) {
    left: 50px;

  }
`