import React, {useContext, useState} from 'react';
import {Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink, Logo} from './navbarStyles';
import {AuthContext} from "../../context/AuthContext";
import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import Alert from "@mui/material/Alert";
import {Snackbar} from "@mui/material";
import {auth, db} from "../../firebase-config";
import {doc, updateDoc} from "firebase/firestore";
import {signOut} from "firebase/auth";

const Navbar = () => {
    const user = useContext(AuthContext);
    const [loginOpen, setLoginOpen] = useState<boolean>(false);
    const [registerOpen, setRegisterOpen] = useState<boolean>(false);
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
    const [registerSuccess, setRegisterSuccess] = useState<boolean>(false)
    const handleSignout = async () => {
        if (auth && auth.currentUser) {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                isOnline: false,
            });
            await signOut(auth);
        }
    };
    return (
        <>
            <Nav>
                <NavLink to="/">
                    <Logo src="/images/damoim_logo.png" alt="로고"/>
                </NavLink>
                <Bars/>
                <NavMenu>
                    {/* <NavLink to ="/rank" activeStyle> */}
                    <NavLink to="/community">
                        커뮤니티
                    </NavLink>
                    <NavLink to="/create-party">
                        파티만들기
                    </NavLink>
                    <NavLink to="/join-party">
                        파티찾기
                    </NavLink>
                    <NavLink to="/rank">
                        순위
                    </NavLink>
                </NavMenu>

                {
                    user
                        ?
                        <>
                            <NavBtn>
                                <NavBtnLink to="/myPage">마이페이지</NavBtnLink>
                            </NavBtn>
                            <NavBtn onClick={handleSignout} >
                                로그아웃
                            </NavBtn>
                        </>
                        :
                        <NavBtn onClick={() => {
                            setLoginOpen(true)
                        }}>
                            <NavBtnLink to="/">로그인</NavBtnLink>
                        </NavBtn>
                }
            </Nav>
            {
                loginOpen &&
                <LoginForm setLoginSuccess={setLoginSuccess} loginOpen={loginOpen} setLoginOpen={setLoginOpen}
                           setRegisterOpen={setRegisterOpen}/>
            }
            {
                registerOpen && <RegisterForm setRegisterSuccess={setRegisterSuccess} setLoginOpen={setLoginOpen}
                                              registerOpen={registerOpen} setRegisterOpen={setRegisterOpen}/>
            }
            {
                <Snackbar open={registerSuccess} autoHideDuration={2000}
                          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                          onClose={() => {
                              setRegisterSuccess(false);
                          }}>
                    <Alert severity="success" sx={{width: '100%'}}>
                        회원가입 및 로그인 성공 !
                    </Alert>
                </Snackbar>
            }
            {
                <Snackbar open={loginSuccess} autoHideDuration={2000}
                          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                          onClose={() => {
                              setLoginSuccess(false);
                          }}>
                    <Alert severity="success" sx={{width: '100%'}}>
                        로그인 성공 !
                    </Alert>
                </Snackbar>
            }
        </>
    );
};

export default Navbar;