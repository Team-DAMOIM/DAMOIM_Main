import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import {
    UserImageWithInfo,
    UserMainCardSection, UserNameWithEmail,
    UserPageCardSection,
    UserPageContainer,
    UserPageHistorySection, UserPageInfoBox,
    UserSemiCardSection
} from "./userPageStyles";
import {CustomHalfTextArea} from "../CreatePartyPage/createPartyPageStyles";
import {AuthContext} from "../../context/AuthContext";
import {Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import CardWithIcon from "../../components/CardWithIcon/CardWithIcon";
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import ThermostatTwoToneIcon from '@mui/icons-material/ThermostatTwoTone';
import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone';
import UserPageFriends from "../../components/UserPageFriends/UserPageFriends";
import UserPagePostHistory from "./UserPagePostHistory";
import UserCommentHistory from "./UserCommentHistory";
import moment from "moment";
import 'moment/locale/ko';
import UserInfoChangeForm from "../../components/UserInfoChangeForm/UserInfoChangeForm";
import {getDocs, query, where} from "firebase/firestore";
import {usersCollectionRef} from "../../firestoreRef/ref";
import {userInfoTypes} from "../../utils/types";
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";

function UserPage(props: any) {
    const user = useContext(AuthContext);
    const [userInfoChangeOpen, setUserInfoChangeOpen] = useState<boolean>(false);
    const [userInfoChangeSuccess,setUserInfoChangeSuccess] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<userInfoTypes>();
    useEffect(() => {
        const getUser = async () => {
            if (user) {
                const userQuery = await query(usersCollectionRef, where("uid", "==", user.uid))
                const data = await getDocs(userQuery);
                setUserInfo(data.docs.map(doc => ({...doc.data()}))[0] as userInfoTypes);
            }
        }
        getUser();
    }, [])

    const [searchCategory, setSearchCategory] = useState("작성 글");

    const handleChange = (event: SelectChangeEvent) => {
        setSearchCategory(event.target.value);
    };


    return (
        <UserPageContainer>
            <CustomHalfTextArea title='마이페이지'
                                content={`다모임과 ${moment(userInfo?.createdAt.toDate()).fromNow()} 부터 함께하고 있어요🥳`}/>
            <UserPageInfoBox>
                <UserPageCardSection>
                    <UserMainCardSection>
                        <UserImageWithInfo>
                            <img src={userInfo?.avatar || '/images/personIcon.png'} alt={"avatar"}/>
                            <UserNameWithEmail>
                                <h4>{userInfo?.name}</h4>
                                <span>{userInfo?.nickName}</span>
                                <span>{userInfo?.email}</span>
                            </UserNameWithEmail>
                        </UserImageWithInfo>
                        <Button variant="contained" startIcon={<ModeEditTwoToneIcon/>} onClick={() => {
                            setUserInfoChangeOpen(true)
                        }}>정보 수정</Button>
                    </UserMainCardSection>

                    <UserSemiCardSection>
                        <CardWithIcon title={"회원권한"} content={"일반회원"} icon={<BadgeTwoToneIcon/>}/>
                        <CardWithIcon title={"매너온도"} content={"40도"} icon={<ThermostatTwoToneIcon/>}/>
                        <CardWithIcon title={"회원가입일"}
                                      content={moment(userInfo?.createdAt.toDate()).format('YYYY년 MM월 DD일')}
                                      icon={<EventNoteTwoToneIcon/>}/>
                    </UserSemiCardSection>
                </UserPageCardSection>
                <UserPageFriends/>
                <UserPageHistorySection>
                    <FormControl sx={{mb: 1, minWidth: 120}}>
                        <InputLabel id="demo-simple-select-helper-label">조회</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={searchCategory}
                            label="조회"
                            onChange={handleChange}
                        >
                            <MenuItem value={'작성 글'}>작성 글</MenuItem>
                            <MenuItem value={'작성 댓글'}>작성 댓글</MenuItem>
                            <MenuItem value={'로그인 기록'} disabled>로그인 기록</MenuItem>
                            <MenuItem value={'쪽지함'} disabled>쪽지함</MenuItem>
                            <MenuItem value={'회원차단내역'} disabled>회원차단내역</MenuItem>
                        </Select>
                        <FormHelperText>조회하고싶은 것을 선택해주세요</FormHelperText>
                    </FormControl>
                    {
                        searchCategory === "작성 글" && <UserPagePostHistory/>
                    }
                    {
                        searchCategory === "작성 댓글" && <UserCommentHistory/>
                    }
                </UserPageHistorySection>
            </UserPageInfoBox>
            {
                userInfoChangeOpen &&
                <UserInfoChangeForm
                                    userInfoChangeOpen={userInfoChangeOpen}
                                    setUserInfoChangeOpen={setUserInfoChangeOpen}
                                    setUserInfo={setUserInfo as Dispatch<SetStateAction<userInfoTypes>>}
                                        userInfo={userInfo as userInfoTypes}
                                    setUserInfoChangeSuccess={setUserInfoChangeSuccess}
                />
            }
            <TopCenterSnackBar value={userInfoChangeSuccess} setValue={setUserInfoChangeSuccess} severity={"success"} content={"프로필 정보 수정 성공!"}/>
        </UserPageContainer>
    );
}

export default UserPage;