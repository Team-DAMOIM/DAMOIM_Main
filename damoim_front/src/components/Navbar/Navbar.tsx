import React, {useContext, useState} from 'react';
import {Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink, Logo} from './navbarStyles';
import {AuthContext} from "../../context/AuthContext";
import Alert from "@mui/material/Alert";
import {Snackbar} from "@mui/material";
import {auth, db} from "../../firebase-config";
import {doc, updateDoc} from "firebase/firestore";
import {signOut} from "firebase/auth";
import UserActionModal from "../UserActionModal/UserActionModal";
import TopCenterSnackBar from "../TopCenterSnackBar/TopCenterSnackBar";

const Navbar = () => {
    const user = useContext(AuthContext);
    const [userActionModalOpen, setUserActionModalOpen] = useState<boolean>(false)
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
    const [registerSuccess, setRegisterSuccess] = useState<boolean>(false)
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState<boolean>(false)
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
                            <NavBtn onClick={handleSignout}>
                                <NavBtnLink to="/">로그아웃</NavBtnLink>
                            </NavBtn>
                        </>
                        :
                        <NavBtn onClick={() => {
                            setUserActionModalOpen(true)
                        }}>
                            <NavBtnLink to="/">로그인</NavBtnLink>
                        </NavBtn>
                }
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
            <TopCenterSnackBar value={resetPasswordSuccess} setValue={setResetPasswordSuccess} severity={"success"}
                               content={"이메일로 임시비밀번호를 보냈습니다. 확인후 로그인 해주세요."}/>
        </>
    );
};

export default Navbar;