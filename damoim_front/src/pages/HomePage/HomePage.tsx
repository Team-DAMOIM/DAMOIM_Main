import React, {useEffect, useState} from 'react';
import MainBanner from '../../components/MainBanner/MainBannerItem';
import OTTSelectBar from '../../components/OTTSelectBar/OTTSelectBar';
import PartyCard from '../../components/PartyCard/PartyCard';
import {HomePageContainer, PartyCardContainer} from "./homePageStyles";
import {RouteComponentProps} from "react-router-dom";
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";
import {initialSelectedOTTs} from "../../utils/variables";
import {DocumentData, getDocs, orderBy, Query, query, where} from 'firebase/firestore';
import {partysCollectionRef} from "../../firestoreRef/ref";
import {partyTypes} from '../../utils/types';
import LoadingCircularProgress from "../../components/LoadingCircularProgress/LoadingCircularProgress";


type Props = RouteComponentProps;

const HomePage: React.FC<Props> = (props) => {

  const [partys, setPartys] = useState<DocumentData[]>([]);
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const [selectedOTTs, setSelectedOTTs] = useState<string[]>(initialSelectedOTTs);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props.location.state) {
      setUserNotFound(true);
    }
    return () => setUserNotFound(false)
  }, [])

  useEffect(() => {
    const getPartys = async () => {
      let partysQuery: Query<DocumentData>;

      partysQuery = await query(partysCollectionRef, orderBy("createdAt", "desc"))

      const data = await getDocs(partysQuery);
      setPartys(data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      } as partyTypes)).filter((party: partyTypes) => {
        let fetch: boolean = false;
        let difference = selectedOTTs.filter(ott => !party.selectedOTTs.includes(ott)); // 차집합

        // 요거 초기화면에서는 OTTSelectedBar가 전부 선택되어있어서 이때는 모든 내용물을 다 보여주기 위한 if문인데 추후 OTTSelecetedBar의 수정이 필요할 듯
        if (selectedOTTs.length === 9) {
          fetch = true
        }
        // ******************************************************* //

        if (selectedOTTs.length !== 0 && difference.length === 0) {
          fetch = true
        }
        return fetch
      }))
    }
    setLoading(true);
    getPartys();
    setLoading(false);
  }, [selectedOTTs])

  if (loading) return <LoadingCircularProgress/>

  return (
    <HomePageContainer>
      <MainBanner/>
      <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs} selectOnlyOne={false}/>
      {/* 이 밑에 '모집중' 하드코딩된거 추후 수정 */}
      <PartyCardContainer>
        {partys.map(party => {
          return (
            <PartyCard
              key={party.id}
              id={party.id}
              OTTsNameArray={party.selectedOTTs}
              headerText='모집중'
              avgTemperature={party.avgTemperature}
              memberNum={party.memberUIDs.length}
            />
          )
        })}
      </PartyCardContainer>
      {
        <TopCenterSnackBar value={userNotFound} setValue={setUserNotFound} severity={"error"}
                           content={"로그인 후 다시 이용해주세요 ! "}/>
      }
    </HomePageContainer>
  );
};

export default HomePage;