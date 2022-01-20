import styled from "styled-components";
import {Link} from "react-router-dom";

export const UserWithProfileContainer = styled(Link)`
  display: flex;
  width: 20%;
  align-items: center;
  img{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 5px;
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

