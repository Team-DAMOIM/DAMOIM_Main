import React, {useState} from 'react';
import {RankingPageContainer} from "./RankingPageStyles";
import OTTSelectBar from "../../components/OTTSelectBar/OTTSelectBar";
import SmallGuide from "../../components/SmallGuide/SmallGuide";
const initialSelectedOTTs = ["netflix"]

function RankingPage(props: any) {
    const [selectedOTTs, setSelectedOTTs] = useState<string[]>(initialSelectedOTTs);

    return (
        <RankingPageContainer>
            <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs} selectOnlyOne/>
            <SmallGuide content={"아이콘을 클릭하여 원하는 정보를 확인하세요"}/>

        </RankingPageContainer>
    );
}

export default RankingPage;