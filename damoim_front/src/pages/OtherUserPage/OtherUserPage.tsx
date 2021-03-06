import React, {useContext, useEffect, useState} from 'react';
import {
  MainInfoCard,
  OtherUserInfoBox,
  OtherUserPageContainer,
  UserImageWithInfo,
  UserNameWithEmail,
  LoadingArea,
  AdditionalInfoCard, OtherUserHistorySection
} from "./OtherUserPageStyles";
import {CustomHalfTextArea} from "../CreatePartyPage/createPartyPageStyles";
import moment from "moment";
import {addDoc, getDocs, query, Timestamp, where} from "firebase/firestore";
import {relationsCollectionRef, usersCollectionRef} from "../../firestoreRef/ref";
import {relationTypes, userInfoTypes} from "../../utils/types";
import {AuthContext} from "../../context/AuthContext";
import {useParams} from "react-router-dom";
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import CardWithIcon from "../../components/CardWithIcon/CardWithIcon";
import BadgeTwoToneIcon from "@mui/icons-material/BadgeTwoTone";
import ThermostatTwoToneIcon from "@mui/icons-material/ThermostatTwoTone";
import EventNoteTwoToneIcon from "@mui/icons-material/EventNoteTwoTone";
import AddIcon from '@mui/icons-material/Add';
import OtherUserPostHistory from "./OtherUserPostHistory";
import OtherUserCommentHistory from "./OtherUserCommentHistory";
import CreateIcon from "@mui/icons-material/Create";
import {LoadingButton} from "@mui/lab";
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";
import LoadingCircularProgress from "../../components/LoadingCircularProgress/LoadingCircularProgress";

const OtherUserPage = () => {
  // OtherUser UID
  const {id} = useParams<{ id: string }>();

  const [nonLogin, setNonLogin] = useState<boolean>(false);

  const user = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<userInfoTypes>();
  const [otherUserInfo, setOtherUserInfo] = useState<userInfoTypes>();
  const [relation, setRelation] = useState<relationTypes>({
    member1: "",
    member2: "",
    state: "notFriend",
    createdAt: Timestamp.fromDate(new Date())
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false)
  const [fail, setFail] = useState<boolean>(false)

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const userQuery = await query(usersCollectionRef, where("uid", "==", user.uid));
        const data = await getDocs(userQuery);
        setUserInfo(data.docs.map(doc => ({...doc.data()}))[0] as userInfoTypes);
      } else {
        setNonLogin(true);
      }
    }
    getUser();
  }, [])

  useEffect(() => {
    const getOtherUser = async () => {
      const userQuery = await query(usersCollectionRef, where("uid", "==", id));
      const data = await getDocs(userQuery);
      setOtherUserInfo(data.docs.map(doc => ({...doc.data()}))[0] as userInfoTypes);
    }
    getOtherUser();
  }, [])

  useEffect(() => {
    const getRelations = async () => {
      if (user) {
        const relationQuery1 = await query(relationsCollectionRef, where("member1", "==", user.uid), where("member2", "==", id));
        const relationQuery2 = await query(relationsCollectionRef, where("member1", "==", id), where("member2", "==", user.uid));
        const data1 = await getDocs(relationQuery1);
        const data2 = await getDocs(relationQuery2);
        if (data1.docs.length !== 0 || data2.docs.length !== 0) {
          if (data1.docs.length !== 0) {
            setRelation(data1.docs.map(doc => ({...doc.data()}))[0] as relationTypes);
          } else {
            setRelation(data2.docs.map(doc => ({...doc.data()}))[0] as relationTypes);
          }
        }
      }
    }
    getRelations();
  }, [success])

  const [searchCategory, setSearchCategory] = useState("?????? ???");

  const handleChange = (event: SelectChangeEvent) => {
    setSearchCategory(event.target.value);
  };

  // ?????? ?????? ?????? ???????????????!
  const addFriend = async (userUID: string, otherUserUID: string) => {
    setLoading(true);
    await addDoc(relationsCollectionRef, {
      member1: userUID,
      member2: otherUserUID,
      state: "nonActive",
      createdAt: Timestamp.fromDate(new Date())
    })
    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 2000)
  };

  if (!((userInfo || nonLogin) && otherUserInfo)) return <LoadingCircularProgress/>

  return (
    <OtherUserPageContainer>

      <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"}
                         content={"?????? ????????? ??????????????????. ????????? ???????????? ?????? ????????? ???????????????."}/>
      <TopCenterSnackBar value={fail} setValue={setFail} severity={"error"} content={"?????? ????????? ??????????????????."}/>

      <CustomHalfTextArea
        title={`"${otherUserInfo.nickName}" ???????????? ????????????`}
        content={`???????????? ${moment(otherUserInfo.createdAt.toDate()).fromNow()} ?????? ???????????? ????????? ????`}
      />
      <OtherUserInfoBox>
        <MainInfoCard>
          <UserImageWithInfo>
            <img src={otherUserInfo.avatar || '/images/personIcon.png'} alt={"avatar"}/>
            <UserNameWithEmail>
              <h4>{otherUserInfo.name}</h4>
              <span>{otherUserInfo.nickName}</span>
              <span>{otherUserInfo.email}</span>
            </UserNameWithEmail>
          </UserImageWithInfo>
          {nonLogin ? <div></div> : userInfo && relation.state === "notFriend" ? (
            <LoadingButton
              variant="contained"
              startIcon={<AddIcon/>}
              onClick={() => {
                addFriend(userInfo.uid, otherUserInfo.uid);
              }}
              loading={loading}
            >
              ????????????
            </LoadingButton>
          ) : relation.state === "active" ? (
            <Button>??????</Button>
          ) : relation.state === "nonActive" ? (
            <Button>?????? ?????? ???</Button>
          ) : <Button>?????? ??? (?????? ??? ?????? ?????? ??????)</Button>}
        </MainInfoCard>

        <AdditionalInfoCard>
          <CardWithIcon title={"????????????"} content={"????????????"} icon={<BadgeTwoToneIcon/>}/>
          <CardWithIcon title={"????????????"} content={`${otherUserInfo.temperature}`} icon={<ThermostatTwoToneIcon/>}/>
          <CardWithIcon title={"???????????????"}
                        content={moment(otherUserInfo.createdAt.toDate()).format('YYYY??? MM??? DD???')}
                        icon={<EventNoteTwoToneIcon/>}/>
        </AdditionalInfoCard>

        <OtherUserHistorySection>
          <FormControl sx={{mb: 1, minWidth: 120}}>
            <InputLabel id="demo-simple-select-helper-label">??????</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={searchCategory}
              label="??????"
              onChange={handleChange}
            >
              <MenuItem value={'?????? ???'}>?????? ???</MenuItem>
              <MenuItem value={'?????? ??????'}>?????? ??????</MenuItem>
              <MenuItem value={'????????? ??????'} disabled>????????? ??????</MenuItem>
              <MenuItem value={'?????????'} disabled>?????????</MenuItem>
              <MenuItem value={'??????????????????'} disabled>??????????????????</MenuItem>
            </Select>
            <FormHelperText>?????????????????? ?????? ??????????????????</FormHelperText>
          </FormControl>
          {
            searchCategory === "?????? ???" && <OtherUserPostHistory otherUserUID={otherUserInfo.uid}/>
          }
          {
            searchCategory === "?????? ??????" && <OtherUserCommentHistory otherUserUID={otherUserInfo.uid}/>
          }
        </OtherUserHistorySection>
      </OtherUserInfoBox>
    </OtherUserPageContainer>
  );
};

export default OtherUserPage;