import React, {useState, useEffect} from 'react';
import OTTSelectBar from '../../components/OTTSelectBar/OTTSelectBar';
import PartyCard from '../../components/PartyCard/PartyCard';
import {JoinPartyPageContainer, PartyCardContainer} from './joinPartyPageStyles';
import {DocumentData, getDocs, orderBy, Query, query, where} from 'firebase/firestore';
import {partysCollectionRef} from "../../firestoreRef/ref";
import {partyTypes} from '../../utils/types';
import HalfTextArea from "../../components/HalfTextArea/HalfTextArea";
import LoadingCircularProgress from "../../components/LoadingCircularProgress/LoadingCircularProgress";
import {getPartyCardHeaderText} from "../../utils/functions";

const initialSelectedOTTs = ["netflix", "disneyPlus", "watcha", "wavve", "tving", "laftel", "appleTV", "amazon", "welaaa"];

const JoinPartyPage = () => {
  const [partys, setPartys] = useState<DocumentData[]>([]);
  const [selectedOTTs, setSelectedOTTs] = useState<string[]>(initialSelectedOTTs);
  const [loading, setLoading] = useState<boolean>(false);

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
    <JoinPartyPageContainer>
      <HalfTextArea title={"파티찾기"} content={"원하는 OTT 서비스를 찾아봐요😘"}/>
      <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs} selectOnlyOne={false}/>
      <PartyCardContainer>
        {partys.map(party => {
          return (
            <PartyCard
              key={party.id}
              id={party.id}
              OTTsNameArray={party.selectedOTTs}
              avgTemperature={party.avgTemperature}
              memberNum={party.memberUIDs.length}
              state={party.state}
            />
          )
        })}
      </PartyCardContainer>
    </JoinPartyPageContainer>
  );
};

export default JoinPartyPage;