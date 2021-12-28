import React, { useState } from 'react';
import OTTSelectBar from '../../components/OTTSelectBar/OTTSelectBar';
import PartyCard from '../../components/PartyCard/PartyCard';
import { JoinPartyPageContainer, PartyCardContainer } from './joinPartyPageStyles';

const initialSelectedOTTs = ["netflix", "disneyPlus", "watcha", "wavve", "tving", "laftel", "appleTV", "amazon", "welaaa"];

const JoinPartyPage = () => {
  const [selectedOTTs, setSelectedOTTs] = useState<string[]>(initialSelectedOTTs);

  return (
    <JoinPartyPageContainer>
      <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs} selectOnlyOne={false} />
      <PartyCardContainer>
        {/* 이 밑에 하드코딩된거 추후 수정 */}
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(() => {
          return(
            <PartyCard
              OTTsNameArray={["netflix", "disneyPlus"]}
              headerText='모집중'
              temperature={40}
              memberNum={2}
            />
          )
        })}
      </PartyCardContainer>
    </JoinPartyPageContainer>
  );
};

export default JoinPartyPage;