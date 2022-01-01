import React, {useContext, useState} from 'react';
import {
    UserImageWithInfo,
    UserMainCardSection, UserNameWithEmail,
    UserPageCardSection,
    UserPageContainer,
    UserPageHistorySection, UserPageInfoBox,
    UserSemiCardSection
} from "./userPageStyles";
import {CustomHalfTextArea } from "../CreatePartyPage/createPartyPageStyles";
import useUserUID from "../../hooks/useUserUID";
import {AuthContext} from "../../context/AuthContext";
import {Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import CardWithIcon from "../../components/CardWithIcon/CardWithIcon";
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import ThermostatTwoToneIcon from '@mui/icons-material/ThermostatTwoTone';
import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone';
import UserPageFriends from "../../components/UserPageFriends/UserPageFriends";
import UserPagePostHistory from "./UserPagePostHistory";

function UserPage(props: any) {
    const user = useContext(AuthContext);

    const userInfo = useUserUID(user);
    const [age, setAge] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value);
    };

    return (
        <UserPageContainer>
            <CustomHalfTextArea title='마이페이지' content='다모임과 함께하신지 벌써 278일이 됐어요🥳'/>
            <UserPageInfoBox>
                <UserPageCardSection>
                    <UserMainCardSection>
                        <UserImageWithInfo>
                            <img src={"/images/personIcon.png"} alt={"sad"}/>
                            <UserNameWithEmail>
                                <h4>{userInfo?.name}</h4>
                                <span>{userInfo?.nickName}</span>
                                <span>{userInfo?.email}</span>
                            </UserNameWithEmail>
                        </UserImageWithInfo>
                        <Button variant="contained" startIcon={<ModeEditTwoToneIcon/>}>정보 수정</Button>
                    </UserMainCardSection>

                    <UserSemiCardSection>
                        <CardWithIcon title={"회원권한"} content={"일반회원"} icon={<BadgeTwoToneIcon/>}/>
                        <CardWithIcon title={"매너온도"} content={"40도"} icon={<ThermostatTwoToneIcon/>}/>
                        <CardWithIcon title={"회원가입일"} content={"2021-12-03"} icon={<EventNoteTwoToneIcon/>}/>
                    </UserSemiCardSection>
                </UserPageCardSection>
                <UserPageFriends/>
                <UserPageHistorySection>
                    <FormControl sx={{ mb:1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label">조회</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={age}
                            label="조회"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>작성 글</MenuItem>
                            <MenuItem value={20}>작성 댓글</MenuItem>
                            <MenuItem value={20} disabled>로그인 기록</MenuItem>
                            <MenuItem value={30} disabled>쪽지함</MenuItem>
                            <MenuItem value={30} disabled>회원차단내역</MenuItem>
                        </Select>
                        <FormHelperText>조회하고싶은 것을 선택해주세요</FormHelperText>
                    </FormControl>
                    <UserPagePostHistory/>
                </UserPageHistorySection>
            </UserPageInfoBox>
        </UserPageContainer>
    );
}

export default UserPage;