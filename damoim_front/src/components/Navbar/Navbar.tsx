import React, {useContext, useEffect, useState} from 'react';
import {Nav} from './navbarStyles';
import {AuthContext} from "../../context/AuthContext";
import {auth, db} from "../../firebase-config";
import {doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {signOut} from "firebase/auth";
import UserActionModal from "../UserActionModal/UserActionModal";
import TopCenterSnackBar from "../TopCenterSnackBar/TopCenterSnackBar";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {Link, useHistory} from 'react-router-dom'
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {partyTypes} from "../../utils/types";
import {partysCollectionRef} from "../../firestoreRef/ref";

const Navbar = () => {
  const user = useContext(AuthContext);
  const history = useHistory();

  const [userActionModalOpen, setUserActionModalOpen] = useState<boolean>(false)
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false)
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<boolean>(false)
  const [logOutSuccess, setLogOutSuccess] = useState<boolean>(false);
  const [clickRank, setClickRank] = useState<boolean>(false)


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

  const [selectedPartyOTTs, setSelectedPartyOTTs] = useState<string>("내 파티");
  const [myParty, setMyParty] = useState<partyTypes[]>();
  useEffect(() => {
    const getMyParty = async () => {
      if (user) {
        const q = await query(partysCollectionRef, where("memberUIDs", "array-contains", user.uid));
        const data = await getDocs(q);

        let resultArr: partyTypes[] = [];

        if (data.docs.length !== 0) {
          resultArr = data.docs.map(doc => ({...doc.data(), id: doc.id}) as partyTypes);
        }

        setMyParty(resultArr);
      }
    }
    getMyParty();
  }, [])

  const myPartyHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPartyOTTs(event.target.value);
  }

  const movePartyPage = (party: partyTypes) => {
    // history.push(`/partyDetail/${party.id}`);
    window.location.replace(`/partyDetail/${party.id}`);
  }

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
            <li className="option" onClick={() => {
              closeMobileMenu();
              setClickRank(true);
            }}>
              순위
            </li>
            <li className="option mobile-option" onClick={closeMobileMenu}>
              {user ? (
                  <>
                    <Link to={`/userPage/${auth.currentUser?.uid}`} className="sign-up">
                      <Button variant="outlined" className="sign-up logout-button">
                        마이페이지
                      </Button>
                    </Link>
                    <Button onClick={handleSignout} variant="outlined"
                            className="sign-up logout-button">
                      로그아웃
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => {
                    setUserActionModalOpen(true);
                  }} variant="outlined" className="sign-up">
                    로그인
                  </Button>
                )
              }
            </li>
          </ul>
        </div>
        <ul className="signin-up">
          <li>
            {
              user ? (
                <>
                  {
                    myParty && (
                      <TextField
                        id="outlined-select-party"
                        select
                        label="내 파티"
                        value={selectedPartyOTTs}
                        onChange={myPartyHandler}
                        InputLabelProps={{shrink: false}}
                        variant="outlined"
                        style={{width: '120px', marginRight: '10px'}}
                      >
                        {myParty.map(party => {
                          return (
                            <MenuItem onClick={() => movePartyPage(party)} value={party.selectedOTTs.toString()}>{party.selectedOTTs.toString()}</MenuItem>
                          )
                        })}
                      </TextField>
                    )
                  }
                  <Link to={`/userPage/${auth.currentUser?.uid}`}>
                    <Button variant="outlined" className="sign-up">
                      마이페이지
                    </Button>
                  </Link>
                  <Button onClick={handleSignout} variant="outlined" className="sign-up logout-button">
                    로그아웃
                  </Button>
                </>
              ) : (
                <Button onClick={() => {
                  closeMobileMenu();
                  setUserActionModalOpen(true);
                }} variant="outlined" className="sign-up">
                  로그인
                </Button>
              )
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
      <TopCenterSnackBar value={clickRank} setValue={setClickRank} severity={"error"}
                         content={"순위 서비스는 준비중입니다."}/>
    </>
  );
};

export default Navbar;