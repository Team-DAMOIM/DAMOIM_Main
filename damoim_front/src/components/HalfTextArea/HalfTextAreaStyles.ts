import styled from "styled-components";

export const HalfTextAreaContainer = styled.div`
  width: 100%;
`

export const HalfTextAreaContentContainer = styled.div`
  padding: 15px;
  margin-top: 50px;
  margin-left: 4vw;
  width: 30%;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: auto;
  box-shadow: rgb(221 221 221) 0px 10px 30px;
  span {
    color: var(--primary-color);
    font-weight: bold;
    font-size: 1.5rem;
  }

  p {
        
  }

  @media screen and (max-width: 1000px) {
    width: 70%;
  }
  

  @media screen and (max-width: 768px) {
    width: 90%;
  }
`