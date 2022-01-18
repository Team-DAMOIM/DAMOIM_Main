import styled from "styled-components";

export const UserPageFriendsContainer = styled.div`
  margin-top: 5vh;
  box-shadow: rgb(0 0 0 / 12%) 0px 3px 6px, rgb(0 0 0 / 24%) 0px 2px 5px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const UserPageFriendsSVGContainer = styled.div`
  svg[data-testid="DeleteTwoToneIcon"],
  svg[data-testid="AddCircleTwoToneIcon"]
  {
    width: 100px;
    height: 100px;
    margin-right: 5vw;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
      color: var(--primary-color);
      transform: scale(1.05);
    }
  }

  svg[data-testid="DeleteTwoToneIcon"]
  {
    &:hover {
      color: red;
    }
  }
`