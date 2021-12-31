import { Snackbar, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import OTTSelectBar from '../../components/OTTSelectBar/OTTSelectBar';
import CustomTransferList from '../../components/CustomTransferList/CustomTransferList';
import { AuthContext } from '../../context/AuthContext';
import { ColFlexInfoCont, CreatePartyBtn, CreatePartyPageContainer, CustomHalfTextArea, InfoInputBox, RawFlexInfoCont } from './createPartyPageStyles';

import { TextField, Alert } from '@mui/material';
import { LocalizationProvider, StaticDatePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns';

const initialSelectedOTTs = ["netflix", "disneyPlus", "watcha", "wavve", "tving", "laftel", "appleTV", "amazon", "welaaa"];

const CreatePartyPage = () => {
  const user = useContext(AuthContext);
  const [selectedOTTs, setSelectedOTTs] = useState<string[]>(initialSelectedOTTs);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [wishPeriod, setWishPeriod] = useState<number>(1);
  const [openChatLink, setOpenChatLink] = useState<string>("https://open.kakao.com/");
  const [memberTalk, setMemberTalk] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false)
  const [fail, setFail] = useState<boolean>(false)

  useEffect(() => {
    console.log(wishPeriod);
    console.log(openChatLink);
  }, [wishPeriod, openChatLink]);

  const createPartyHandler = async () => {
    if (user) {

    }
  }

  return (
    user ? (

    
      <CreatePartyPageContainer>
        {/* 알림창 부분 */}
        <Snackbar open={success} autoHideDuration={2000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          onClose={() => {
            setSuccess(false);
          }}
        >
          <Alert severity="success" sx={{width: '100%'}}>
            파티를 만들었습니다!
          </Alert>
        </Snackbar>
        <Snackbar open={fail} autoHideDuration={2000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          onClose={() => {
              setFail(false);
          }}
        >
          <Alert severity="error" sx={{width: '100%'}}>
              양식에 맞게 글을 작성해주세요
          </Alert>
        </Snackbar>
          
        {/* 페이지 소개 */}
        <CustomHalfTextArea title='파티만들기' content='파티장이 작성해주세요! 작성자는 자동으로 파티장이 됩니다🥳'/>

        <InfoInputBox>
          <ColFlexInfoCont>
            {/* OTT 선택하기 부분 */}
            <Typography fontSize={40} align='left'>구독할 OTT</Typography>
            <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs} selectOnlyOne={false}/>
          </ColFlexInfoCont>
          
          <ColFlexInfoCont>
            {/* 멤버 선택하기 */}
            <Typography fontSize={40} align='left'>초기 파티원 선택</Typography>
            <Typography variant='body1' align='left'>(친구추가가 된 유저만 초기 파티원로 추가할 수 있습니다. 초기 파티원이 없다면 넘어가도 됩니다 😉)</Typography>
            <br/>
            <CustomTransferList/>
          </ColFlexInfoCont>
          
          <RawFlexInfoCont>
            <ColFlexInfoCont>
              {/* 시작일(갱신일) */}
              <Typography fontSize={40} align='left' style={{margin: '0 auto'}}>시작일(갱신일)</Typography>
              <br/>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  openTo="day"
                  disablePast
                  value={startDate}
                  onChange={(newStartDate) => {
                    setStartDate(newStartDate);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </ColFlexInfoCont>
            <ColFlexInfoCont>
              {/* 구독희망기간 */}
              <Typography fontSize={40} align='left'>구독 희망 기간(개월)</Typography>
              <br/>
              <TextField
                required
                label="개월수"
                type="number"
                InputProps={{ inputProps: { min: 1, max: 12 } }}
                helperText="최소 1개월 ~ 최대 12개월 선택 가능"
                value={wishPeriod}
                onChange = {(e: React.ChangeEvent<HTMLInputElement>)=> {
                  setWishPeriod(parseInt(e.target.value));
                  console.log(wishPeriod);
                }}
                error={wishPeriod < 0 || wishPeriod > 13 ? true : false }
              />
              <br/><br/><br/>
              
              {/* 오픈채팅 URL */}
              <Typography fontSize={40} align='left'>오픈채팅 URL</Typography>
              <br/>
              <TextField
                required
                label="링크 주소"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
                helperText="파티 가입 희망자가 연락하기 위한 카카오톡 오픈채팅 링크를 입력해주세요."
                onChange = {(e: React.ChangeEvent<HTMLInputElement>)=> {
                  setOpenChatLink(e.target.value);
                }}
                placeholder='https://open.kakao.com/'
                error={openChatLink?.slice(0, 23) !== "https://open.kakao.com/" ? true : false }
              />
            </ColFlexInfoCont>
          </RawFlexInfoCont>

          <ColFlexInfoCont>
              {/* 파티원에게 한마디 */}
              <Typography fontSize={40} align='left'>파티원에게 한마디</Typography>
              <br/>
              <TextField
                label="코멘트"
                multiline
                inputProps={{
                  maxlength: 100
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={memberTalk}
                onChange = {(e: React.ChangeEvent<HTMLInputElement>)=> {
                  setMemberTalk(e.target.value);
                }}
                placeholder='욕설, 비속어, 타인을 비방하는 문구를 사용하시면 운영자가 임의로 삭제할 수 있습니다.'
                helperText="파티 가입 희망자에게 남길 말을 작성해주세요."
              />
            </ColFlexInfoCont>

            {/* 파티 만들기 버튼 */}
            <CreatePartyBtn>파티 만들기</CreatePartyBtn>
        </InfoInputBox>
      </CreatePartyPageContainer>
    ) : <Alert severity="error" sx={{width: '100%'}}>로그인 먼저 해주세요!</Alert>
  );
};

export default CreatePartyPage;