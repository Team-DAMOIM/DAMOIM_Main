import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";
import { FaBars } from "react-icons/fa"

export const Nav = styled.nav`
  background: #fff;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem calc((100vw - 1000px) / 2);
  z-index: 10;
  
`

export const NavLink = styled(Link)`
  color: black;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  width: 120px;
  text-align: center;
  line-height: 80px;
  display: flex;  
  align-items: center;
  &.active {
    color: #15cdfc;
  }
`

export const Logo = styled.img`
  width: 118.8px;
  height: 20px;
`

export const Bars = styled(FaBars)`
  display: none;
  color: #fff;

  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -24px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 24px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`

export const NavBtnLink = styled(Link)`
  border-radius: 20px;
  background: #fff;
  padding: 10px 22px;
  color: black;
  border: solid 1px black;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;
  }
`