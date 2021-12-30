import styled from "styled-components";

export const DialogContentContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`

export const LoginImageContainer = styled.div`
  width: 100%;
`

export const LoginRightContentContainer = styled.div`
  width: 100%;
  padding: 2vw;
`

export const LoginTextFieldContainer = styled.div`
  width: 100%;
  margin: 4vh 0;

  .forget-password {
    text-align: end;
    color: #777;
    transition: all 0.5s ease-in-out;
    cursor: pointer;

    &:hover {
      color: black;
    }
  }

  .MuiButton-outlinedSizeMedium {
    margin-top: 4vh;
  }

`

export const LoginTitleContainer = styled.div`
  width: 100%;

  span {
    margin-top: 5px;
    color: #777;
  }
`

export const SocialLoginContainer = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
`

export const SocialLoginIconContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 3vh 0;
  img{
    margin: 1vh;
    width: 35px;
    height: 35px;
  }
`

export const RegisterGuideContainer = styled.div`
  width: 100%;
  text-align: center;
  
`