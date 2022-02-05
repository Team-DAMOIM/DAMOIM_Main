import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import OTTSelectBar from '../../components/OTTSelectBar/OTTSelectBar';
import CustomTransferList from '../../components/CustomTransferList/CustomTransferList';
import {Typography} from '@mui/material';
import {AuthContext} from '../../context/AuthContext';
import {
  ColFlexInfoCont,
  CreatePartyBtn,
  CreatePartyPageContainer,
  InfoInputBox,
  RawFlexInfoCont,
  CustomHalfTextArea
} from './createPartyPageStyles';

import {TextField} from '@mui/material';
import {LocalizationProvider, StaticDatePicker} from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {addDoc, doc, getDoc, getDocs, query, Timestamp, where} from 'firebase/firestore';
import {partysCollectionRef, relationsCollectionRef} from '../../firestoreRef/ref';
import {db} from '../../firebase-config';
import {partyTypes, relationTypes} from "../../utils/types";
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";
import LoadingCircularProgress from "../../components/LoadingCircularProgress/LoadingCircularProgress";


const CreatePartyPage = () => {
  const user = useContext(AuthContext);
  const history = useHistory();
  const [selectedOTTs, setSelectedOTTs] = useState<string[]>([]);

  const [friendUIDs, setFriendUIDs] = useState<string[]>([]);
  const [memberUIDs, setMemberUIDs] = useState<string[]>([]);

  const [haveFriend, setHaveFriend] = useState<boolean>(false);
  const [noFriend, setNoFriend] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [wishPeriod, setWishPeriod] = useState<number>(1);
  const [openChatLink, setOpenChatLink] = useState<string>("https://open.kakao.com/");
  const [memberTalk, setMemberTalk] = useState<string>("");

  // const [temperature, setTemperature] = useState<number[]>([]);
  // const [avgTemperature, setAvgTemperature] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false)
  const [fail, setFail] = useState<boolean>(false)
  const [titleFontSize, setTitleFontSize] = useState<number>(40)

  const [width, setWidth] = useState(window.innerWidth);
  const handleResize = () => {
    setWidth(window.innerWidth)
  }


  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })


  useEffect(() => {
    if (width > 768) {
      setTitleFontSize(40);
    } else if (width > 480) {
      setTitleFontSize(26)
    } else {
      setTitleFontSize(18)
    }
  }, [width])

  // 친구 목록 불러오기
  useEffect(() => {
    const getRelations = async () => {
      if (user) {
        const relationQuery1 = await query(relationsCollectionRef, where("member1", "==", user.uid), where("state", "==", "active"));
        const relationQuery2 = await query(relationsCollectionRef, where("member2", "==", user.uid), where("state", "==", "active"));
        const data1 = await getDocs(relationQuery1);
        const data2 = await getDocs(relationQuery2);
        let data1Array = data1.docs.map((doc) => ({...doc.data()} as relationTypes));
        let data2Array = data2.docs.map((doc) => ({...doc.data()} as relationTypes));
        let mergeData = data1Array.concat(data2Array);

        if (mergeData.length === 0) {
          setNoFriend(true);
        } else {
          let resultArr = [];
          for (let i = 0; i < mergeData.length; i++) {
            if (mergeData[i].member1 === user.uid) {
              resultArr.push(mergeData[i].member2)
            } else {
              resultArr.push(mergeData[i].member1)
            }
          }
          setFriendUIDs(resultArr);
          setHaveFriend(true);
        }

      }
    }
    getRelations();
  }, [])

  // 가입한 모든 OTT 불러오기
  const [userSubscribeOTTs, setUserSubscribeOTTs] = useState<string[]>();
  useEffect(() => {
    const getMySubscribeOTTs = async () => {
      if (user) {
        const q = await query(partysCollectionRef, where("memberUIDs", "array-contains", user.uid));
        const data = await getDocs(q);

        let resultArr: string[] = [];

        if (data.docs.length !== 0) {
          data.docs.map(doc => {
            resultArr = [...resultArr, ...doc.data().selectedOTTs];
          });

          // 배열의 중복값 제거
          const set = new Set(resultArr);
          resultArr = [];
          resultArr = [...set];
        }

        setUserSubscribeOTTs(resultArr);
      }
    }
    getMySubscribeOTTs();
  }, [])

  const addParty = async (UIDs: string[], startDate: Date, hostUID: string) => {
    let temperatures: number[] = [];
    for (let i = 0; i < UIDs.length; i++) {
      const docRef = doc(db, "users", UIDs[i]);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // setTemperature(temperature => [...temperature, docSnap.data().temperature]);
        temperatures.push(docSnap.data().temperature);
      } else {
        console.log("No such document!");
      }
    }

    let sum: number = 0;
    for (let j = 0; j < temperatures.length; j++) {
      sum += temperatures[j];
    }
    let avgTemperature = Math.round((sum / temperatures.length));

    await addDoc(partysCollectionRef, {
      selectedOTTs: selectedOTTs,
      memberUIDs: memberUIDs,
      startDate: Timestamp.fromDate(startDate),
      wishPeriod: wishPeriod,
      openChatLink: openChatLink,
      memberTalk: memberTalk,
      hostUID: hostUID,
      avgTemperature: avgTemperature,
      createdAt: Timestamp.fromDate(new Date()),
      state: "nonActive"
    })
  }

  const createPartyHandler = async () => {

    // 이미 구독(파티참여)한 OTT가 있는지 검사
    let duplicateOTTs: string[] = []; // 선택한 OTT와 이미 가입한 OTT(중복된 OTT들) 배열
    selectedOTTs.map(ott => {
      if (userSubscribeOTTs?.includes(ott)) {
        duplicateOTTs.push(ott)
      }
    })
    console.log("duplicateOTTs : ", duplicateOTTs);

    if (!selectedOTTs.length) {
      alert('구독할 OTT를 적어도 하나 이상 선택해주세요')
    } else if (duplicateOTTs.length > 0) {
      alert(`${duplicateOTTs.toString()}는 이미 구독(파티참여)한 OTT입니다. 동일한 OTT로 여러 개의 파티에 가입할 수 없습니다!`)
    } else if (openChatLink?.slice(0, 23) !== "https://open.kakao.com/" || openChatLink.length < 25) {
      alert('오픈채팅 URL을 양식에 맞게 정확히 입력해주세요')
    } else {
      setLoading(true);
      if (startDate && user) {
        memberUIDs.splice(0, 0, user.uid);

        addParty(memberUIDs, startDate, user.uid);

        setLoading(false);
        setSuccess(true);

        setTimeout(() => {
          history.push('/join-party')
        }, 1500)
      } else {
        alert('날짜 오류')
      }
    }
  }

  if (!(user && (haveFriend || noFriend) && userSubscribeOTTs)) return <LoadingCircularProgress/>

  return (
    <CreatePartyPageContainer>
      {/* 알림창 부분 */}
      <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"} content={"파티를 만들었습니다!"}/>
      <TopCenterSnackBar value={fail} setValue={setFail} severity={"error"} content={"필수 기입 항목들을 양식에 맞게 작성해주세요!"}/>

      {/* 페이지 소개 */}
      <CustomHalfTextArea title='파티만들기' content='파티장이 작성해주세요! 작성자는 자동으로 파티장이 됩니다🥳'/>

      <InfoInputBox>
        <ColFlexInfoCont>
          {/* OTT 선택하기 부분 */}
          <Typography fontSize={titleFontSize} align='left'>구독할 OTT</Typography>
          <Typography variant='body1' align='left'>(이미 구독(파티참여) 중인 OTT는 선택이 불가능 합니다)</Typography>
          <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs} selectOnlyOne={false}/>
        </ColFlexInfoCont>

        <ColFlexInfoCont>
          {/* 멤버 선택하기 */}
          <Typography fontSize={titleFontSize} align='left'>초기 파티원 선택</Typography>
          <Typography variant='body1' align='left'>(친구추가가 된 유저만 초기 파티원로 추가할 수 있습니다. 초기 파티원이 없다면 넘어가도 됩니다
            😉)</Typography>
          <br/>
          <CustomTransferList leftValue={friendUIDs} setLeftValue={setFriendUIDs} rightValue={memberUIDs} setRightValue={setMemberUIDs}/>
        </ColFlexInfoCont>

        <RawFlexInfoCont>
          <ColFlexInfoCont>
            {/* 시작일(갱신일) */}
            <Typography fontSize={titleFontSize} align='left' style={{margin: '0 auto'}}>시작일(갱신일)</Typography>
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
            <Typography fontSize={titleFontSize} align='left'>구독 희망 기간(개월)</Typography>
            <br/>
            <TextField
              required
              label="개월수"
              type="number"
              InputProps={{inputProps: {min: 1, max: 12}}}
              helperText="최소 1개월 ~ 최대 12개월 선택 가능"
              value={wishPeriod}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setWishPeriod(parseInt(e.target.value));
                console.log(wishPeriod);
              }}
              error={wishPeriod < 0 || wishPeriod > 13}
            />
            <br/><br/><br/>

            {/* 오픈채팅 URL */}
            <Typography fontSize={titleFontSize} align='left'>오픈채팅 URL</Typography>
            <br/>
            <TextField
              required
              label="링크 주소"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              helperText="파티 가입 희망자가 연락하기 위한 카카오톡 오픈채팅 링크를 입력해주세요."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setOpenChatLink(e.target.value);
              }}
              placeholder='https://open.kakao.com/'
              error={openChatLink?.slice(0, 23) !== "https://open.kakao.com/"}
            />
          </ColFlexInfoCont>
        </RawFlexInfoCont>

        <ColFlexInfoCont>
          {/* 파티원에게 한마디 */}
          <Typography fontSize={titleFontSize} align='left'>파티원에게 한마디</Typography>
          <br/>
          <TextField
            label="코멘트"
            multiline
            inputProps={{
              maxLength: 100
            }}
            InputLabelProps={{
              shrink: true,
            }}
            value={memberTalk}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setMemberTalk(e.target.value);
            }}
            placeholder='욕설, 비속어, 타인을 비방하는 문구를 사용하시면 운영자가 임의로 삭제할 수 있습니다.'
            helperText="파티 가입 희망자에게 남길 말을 작성해주세요."
          />
        </ColFlexInfoCont>

        {/* 파티 만들기 버튼 */}
        <CreatePartyBtn onClick={createPartyHandler}>파티 만들기</CreatePartyBtn>
      </InfoInputBox>
    </CreatePartyPageContainer>
  );
};

export default CreatePartyPage;