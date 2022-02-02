import styled from "styled-components";


export const ScrollToTopButtonContainer = styled.button<{BtnStatus:boolean}>`
  
    position: fixed;
    opacity: ${props => props.BtnStatus ? 1 : 0};
    bottom: 40px;
    right: 40px;
    z-index: ${props => props.BtnStatus ? 150 : -10};
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: lightpink;
    color: blueviolet;
    border: 2px solid blueviolet;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: -0.06em;
    box-shadow: 1px 1px 6px 3px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: opacity 0.6s ease-in, transform 0.3s ease-in;
    
  
    &:hover,
    &:focus,
    &:active{
      transform: translate3d(0,-10px,0);
    }


  @media screen and (max-width: 500px) {
    bottom: 15px;
    right: 15px;
  }
  
`