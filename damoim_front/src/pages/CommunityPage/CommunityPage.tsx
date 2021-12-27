import React, {useState} from 'react';

import {CommunityPageContainer} from "./communityPageStyles";
import OTTSelectBar from "../../components/OTTSelectBar/OTTSelectBar";

const initialSelectedOTTs = ["netflix","watcha","wavve","tving","disney","laftel"]
function CommunityPage(props:any) {
    // ["netflix","watcha"] <- 넷플릭스와 왓챠가 선택되었다면
    const [selectedOTTs,setSelectedOTTs] = useState<string[]>(initialSelectedOTTs);

    return (
        <CommunityPageContainer>
            <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs}/>
        </CommunityPageContainer>
    );
}

export default CommunityPage;