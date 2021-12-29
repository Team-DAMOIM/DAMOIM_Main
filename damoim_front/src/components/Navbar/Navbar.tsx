import React from 'react';
import { Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink, Logo } from './navbarStyles';

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavLink to="/">
          <Logo src="/images/damoim_logo.png" alt="로고" />
        </NavLink>
        <Bars />
        <NavMenu>
          {/* <NavLink to ="/rank" activeStyle> */}
          <NavLink to ="/community">
            커뮤니티
          </NavLink>
          <NavLink to ="/create-party">
            파티만들기
          </NavLink>
          <NavLink to ="/join-party">
            파티찾기
          </NavLink>
          <NavLink to ="/rank">
            순위
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