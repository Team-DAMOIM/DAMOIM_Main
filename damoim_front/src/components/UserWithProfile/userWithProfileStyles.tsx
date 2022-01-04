import styled from "styled-components";

export const UserWithProfileContainer = styled.div`
  display: flex;
  width: 20%;
  img{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 2px;
  }

  span {
    color: black;
  }
  @media screen and (max-width: 768px) {
    width: 40%;
  }

  @media screen and (max-width: 480px) {
    width: 100%;
    img{
      width: 20px;
      height: 20px;
    }
  }
`

