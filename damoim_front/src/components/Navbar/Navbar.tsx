import React, {useContext, useEffect, useState} from 'react';
import {Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink, Logo} from './navbarStyles';
import {AuthContext} from "../../context/AuthContext";
import {auth, db} from "../../firebase-config";
import {doc, updateDoc} from "firebase/firestore";
import {signOut} from "firebase/auth";
import UserActionModal from "../UserActionModal/UserActionModal";
import TopCenterSnackBar from "../TopCenterSnackBar/TopCenterSnackBar";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from 'react-router-dom'
import {Button} from "@mui/material";

const Navbar = () => {
    const user = useContext(AuthContext);
    const [userActionModalOpen, setUserActionModalOpen] = useState<boolean>(false)
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
    const [registerSuccess, setRegisterSuccess] = useState<boolean>(false)
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState<boolean>(false)
    const [logOutSuccess, setLogOutSuccess] = useState<boolean>(false);
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const handleSignout = async () => {
        if (auth && auth.currentUser) {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                isOnline: false,
            });
            await signOut(auth);
            setLogOutSuccess(true);
        }
    };
    return (
        <>
            <Nav>
                <div className="logo-nav">
                    <div className="logo-container" onClick={closeMobileMenu}>
                        <Link to={"/"}>
                            <img src="/images/damoim_logo.png" className="logo"/>
                        </Link>
                    </div>
                    <ul className={click ? "nav-options active" : "nav-options"}>
                        <li className="option" onClick={closeMobileMenu}>
                            <Link to="/community">커뮤니티</Link>
                        </li>
                        <li className="option" onClick={closeMobileMenu}>
                            <Link to="/create-party">파티만들기</Link>
                        </li>
                        <li className="option" onClick={closeMobileMenu}>
                            <Link to="/join-party">파티찾기</Link>
                        </li>
                        <li className="option" onClick={closeMobileMenu}>
                            <Link to="/rank">순위</Link>
                        </li>
                        <li className="option mobile-option" onClick={closeMobileMenu}>
                            {
                                user ? <>

                                        <Link to={"/userPage/${auth.currentUser?.uid}"}>
                                            <Button variant="outlined" className="sign-up">
                                                마이페이지
                                            </Button>
                                        </Link>
                                        <Button onClick={handleSignout} variant="outlined"
                                                className="sign-up logout-button">
                                            로그아웃
                                        </Button>
                                    </> :

                                    <Button onClick={() => {
                                        setUserActionModalOpen(true);
                                    }} variant="outlined" className="sign-up">
                                        로그인
                                    </Button>

                            }
                        </li>
                    </ul>
                </div>
                <ul className="signin-up">
                    <li>
                        {
                            user ? <>
                                    <Link to={`/userPage/${auth.currentUser?.uid}`}>
                                        <Button variant="outlined" className="sign-up">
                                            마이페이지
                                        </Button>
                                    </Link>
                                    <Button onClick={handleSignout} variant="outlined" className="sign-up logout-button">
                                        로그아웃
                                    </Button>
                                </> :

                                <Button onClick={() => {
                                    closeMobileMenu();
                                    setUserActionModalOpen(true);
                                }} variant="outlined" className="sign-up">
                                    로그인
                                </Button>
                        }
                    </li>
                </ul>
                <div className="mobile-menu" onClick={handleClick}>
                    {click ? (
                        <CloseIcon className="menu-icon"/>
                    ) : (
                        <MenuIcon className="menu-icon"/>
                    )}
                </div>
            </Nav>

            {
                userActionModalOpen && <UserActionModal
                    setLoginSuccess={setLoginSuccess}
                    setRegisterSuccess={setRegisterSuccess}
                    setResetPasswordSuccess={setResetPasswordSuccess}
                    userActionModalOpen={userActionModalOpen}
                    setUserActionModalOpen={setUserActionModalOpen}/>
            }
            <TopCenterSnackBar value={registerSuccess} setValue={setRegisterSuccess} severity={"success"}
                               content={"회원가입 및 로그인 성공 ! "}/>
            <TopCenterSnackBar value={loginSuccess} setValue={setLoginSuccess} severity={"success"}
                               content={"로그인 성공 !"}/>
            <TopCenterSnackBar value={logOutSuccess} setValue={setLogOutSuccess} severity={"success"}
                               content={"로그아웃 성공 !"}/>
            <TopCenterSnackBar value={resetPasswordSuccess} setValue={setResetPasswordSuccess} severity={"success"}
                               content={"이메일로 임시비밀번호를 보냈습니다. 확인후 로그인 해주세요."}/>
        </>
    );
};

export default Navbar;