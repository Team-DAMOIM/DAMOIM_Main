import styled from "styled-components";


interface OTTIconContainerProps{
    selected:boolean
}

export const OTTIconContainer = styled.div<OTTIconContainerProps>`
  margin: auto;
  display: flex;
  align-content: center;
  
  img {
    border-radius: 10px;
    cursor: pointer;
    width: 75px;
    height: 75px;
    margin: 10px 15px;
    opacity: ${props => props.selected ? 1.0 : 0.2};
    transition: all 0.1s linear 0s;
    box-shadow: rgb(210 210 210) 10px 10px 10px;

    &:hover {
      transform: scale(1.1)
    }
  }
`