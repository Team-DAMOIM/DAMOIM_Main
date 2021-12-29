import styled from "styled-components";

export const CommentForm = styled.form`
  display: flex;
  textarea{
    width: 100%;
    border-radius: 5px;
    resize: none;
    margin-right: 0.3rem;
  }
  
  button{
    border-radius: 5px;
    width: 20%;
    height: 54px;
  }
`

export const ReplyCommentContainer = styled.div`
  width: 80%;
  margin-left: 40px;

  @media screen and (max-width: 768px) {
    width: 90%;
    margin-left: 20px;
  }
  
`

export const ReplyGuideContainer = styled.p`
  font-size: 14px;
  margin: 0;
  color: gray;
  display: flex;
  cursor: pointer;
`

export const AntdCommentContainer = styled.div`
  a{
    color: black;
    font-weight: bold;
  }
`