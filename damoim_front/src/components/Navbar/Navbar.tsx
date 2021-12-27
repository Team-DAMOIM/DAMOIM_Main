import React from 'react';
import { Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink } from './navbarStyles';

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavLink to="/">
          <h1>Logo</h1>
        </NavLink>
        <Bars />
        <NavMenu>
          {/* <NavLink to ="/rank" activeStyle> */}
          <NavLink to ="/rank">
            순위
          </NavLink>
          <NavLink to ="/create-party">
            파티만들기
          </NavLink>
          <NavLink to ="/join-party">
            파티찾기
          </NavLink>
          <NavLink to ="/community">
            커뮤니티
          </NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to="/login">로그인</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;