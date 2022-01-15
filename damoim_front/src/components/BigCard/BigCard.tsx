import styled from "styled-components";

export const BigCard = styled.div`

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 90%;
  margin: 50px auto 0;
  height: 100%;
  border: 3px solid gray;
  border-radius: 20px;
  box-shadow: rgb(0 0 0 / 12%) 0px 3px 6px, rgb(0 0 0 / 24%) 0px 2px 5px;
  padding: 30px 50px 100px;
  row-gap: 50px;
  @media screen and (max-width: 768px) {
    padding: 1vh;
  }
`