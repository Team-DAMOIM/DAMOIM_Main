import React, { useState, useEffect } from 'react';
import OTTSelectBar from '../../components/OTTSelectBar/OTTSelectBar';
import PartyCard from '../../components/PartyCard/PartyCard';
import { JoinPartyPageContainer, PartyCardContainer } from './joinPartyPageStyles';
import { DocumentData, getDocs, orderBy, Query, query, where } from 'firebase/firestore';
import { partysCollectionRef } from "../../firestoreRef/ref";
import { partyTypes } from '../../utils/types';

const initialSelectedOTTs = ["netflix", "disneyPlus", "watcha", "wavve", "tving", "laftel", "appleTV", "amazon", "welaaa"];

const JoinPartyPage = () => {
  const [partys, setPartys] = useState<DocumentData[]>([]);
  const [selectedOTTs, setSelectedOTTs] = useState<string[]>(initialSelectedOTTs);

  useEffect (() => {
    const getPartys = async () => {
      let partysQuery: Query<DocumentData>;

      partysQuery = await query(partysCollectionRef, orderBy("createdAt", "desc"))

      const data = await getDocs(partysQuery);
      setPartys(data.docs.map((doc) => ({...doc.data(), id: doc.id} as partyTypes)).filter((party: partyTypes) => {
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
    getPartys()
  }, [selectedOTTs])

  return (
    <JoinPartyPageContainer>
      <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs} selectOnlyOne={false} />
      <PartyCardContainer>
        {/* 이 밑에 '모집중' 하드코딩된거 추후 수정 */}
        {partys.map(party => {
          return (
            <PartyCard
              id={party.id}
              OTTsNameArray={party.selectedOTTs}
              headerText='모집중'
              avgTemperature={party.avgTemperature}
              memberNum={party.memberUIDs.length}
            />
          )
        })}
      </PartyCardContainer>
    </JoinPartyPageContainer>
  );
};

export default JoinPartyPage;