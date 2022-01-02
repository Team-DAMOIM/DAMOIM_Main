import styled from "styled-components";

export const UserInfoChangeFileInputContainer = styled.div`
  margin-top: 5vh;
  display: flex;
  justify-content: space-evenly;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    box-shadow: rgb(0 0 0 / 12%) 0px 6px 12px, rgb(0 0 0 / 24%) 0px 5px 8px;

  }
`

export const UserInfoChangeFileSVGContainer = styled.div`
  svg {
    width: 100px;
    height: 100px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {

      color: gray;
    }
  }
`