import styled from "styled-components";
import {Link} from "react-router-dom";

export const FriendListFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  border: 0 solid #000;
  background-color: white;
  border-radius: 12px;
`

export const HeaderArea = styled.div`
  border-bottom: 1px solid rgba(var(--b6a,219,219,219),1);
  width: 100%;
  height: 42px;
  text-align: center;
  line-height: 42px;
  font-size: 18px;
  font-weight: bold;
`

export const MainArea = styled.div`
  height: 85%;
  padding: 5px 10px;
  width: 100%;
`

export const SLink = styled(Link)`
  display: inline-block;
  width: 100%;
`