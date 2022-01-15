import styled from "styled-components";

export const CardWithIconContainer = styled.div`
  display: flex;
  padding: 1vw;
  justify-content: space-between;
  border-radius: 5px;
  box-shadow: rgb(0 0 0 / 12%) 0px 3px 6px, rgb(0 0 0 / 24%) 0px 2px 5px;
  
  svg{
    width: 50px;
    height: 50px;
    
  }
`

export const CardWithIconContentContainer = styled.div`
  span{
    color: #444;
  }
  
  h4{
    margin-top: 1vh;
    font-size: 1.25rem;
    font-weight: bold;
  }
`