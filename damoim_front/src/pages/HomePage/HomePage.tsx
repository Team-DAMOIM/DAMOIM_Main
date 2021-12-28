import React, { useState } from 'react';
import OTTSelectBar from '../../components/OTTSelectBar/OTTSelectBar';
import PartyCard from '../../components/PartyCard/PartyCard';
import {HomePageContainer, MainBanner, PartyCardContainer} from "./homePageStyles";

const initialSelectedOTTs = ["netflix", "disneyPlus", "watcha", "wavve", "tving", "laftel", "appleTV", "amazon", "welaaa"];

const HomePage = () => {
  const [selectedOTTs, setSelectedOTTs] = useState<string[]>(initialSelectedOTTs);

  return (
    <HomePageContainer>
      <MainBanner>Main Banner</MainBanner>
      <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs} selectOnlyOne={false}/>
      <PartyCardContainer>
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(() => {
          return(
            <PartyCard OTTArray={["netflix", "disneyPlus"]} headerText='모집중' temperature={40}></PartyCard>
          )
        })}
      </PartyCardContainer>
    </HomePageContainer>
  );
};

export default HomePage;