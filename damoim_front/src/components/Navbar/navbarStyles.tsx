import styled from "styled-components";
import {NavLink as Link} from "react-router-dom";
import {FaBars} from "react-icons/fa"

export const Nav = styled.nav`
  display: flex;
  background: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 0px 40px;
  height: 80px;
  /*Desktop View*/


  .logo-nav {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo {
    width: 118.8px;
    height: 22px;
    margin-bottom: 4px;
  }

  .nav-options {
    padding-left: 5vw;
    display: grid;
    grid-template-columns: repeat(4, auto);
    grid-gap: 50px;
    list-style-type: none;

  }

  .mobile-option {
    display: none;
  }

  .option {
    font-weight: bold;
    cursor: pointer;
  }

  .option > a {

    color: black;
  }

  .option :hover {

  }

  .signin-up {
    display: flex;
    padding: 0px 5px;
    list-style-type: none;

    button {
      color: black;
      border: 1px solid #000;
    }
  }

  .sign-in {
    padding-right: 50px;
    align-self: center;
  }

  .sign-up {
    font-weight: bold;

    a {
      color: black;
    }
  }

  .sign-in :hover {
    color: white;
  }

  .mobile-menu {
    display: none;
  }

  .logout-button {
    margin-left: 1vw;
  }

  @media (max-width: 768px) {
    /*Mobile View */
    .header {
      padding: 0px 10px;
    }

    .logo {
      width: 118.8px;
      height: 22px;
    }

    .nav-options {
      display: flex;
      width: 100%;
      height: 100vh;
      position: absolute;
      top: 80px;
      left: -100%;
      opacity: 0;
      transition: all 0.5s ease;
      flex-direction: column;
      list-style-type: none;
      grid-gap: 0px;
    }

    .nav-options.active {
      background: linear-gradient(#fff, #3f87d0);
      left: 0;
      opacity: 1;
      transition: all 0.5s ease;
      z-index: 5;
      align-content: center;
      padding-left: 0px;
    }

    .menu-icon {
      width: 45px;
      height: 45px;
    }

    .option {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 10vw;
      padding: 30px 0px;
    }

    .sign-up {
      border-radius: 3px;
      padding: 20px 0px;
      width: 90vw;
      align-self: center;
      border-radius: 35px;
    }

    .signin-up {
      display: none;
    }

    .mobile-menu {
      display: block;
    }

    .mobile-option {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      margin-top: 5vh;

      button {
        margin-left: 0;
        margin-top: 2vh;

        color: black;
        border: 1px solid #000;
      }
    }
  }




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
  widht: border-radius: 20px;
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