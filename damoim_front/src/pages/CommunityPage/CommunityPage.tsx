import React, {useState} from 'react';

import {
  CommunityButtonContainer,
  CommunityPageContainer, CommunityTableContainer,
} from "./communityPageStyles";
import OTTSelectBar from "../../components/OTTSelectBar/OTTSelectBar";
import HalfTextArea from "../../components/HalfTextArea/HalfTextArea";
import SmallGuide from "../../components/SmallGuide/SmallGuide";
import CommunityPageButtons from "./CommunityPageButtons";
import CommunityPageTable from "./CommunityPageTable";
import {initialSelectedOTTs} from "../../utils/variables";


function CommunityPage() {
  // ["netflix","watcha"] <- 넷플릭스와 왓챠가 선택되었다면
  const [selectedOTTs, setSelectedOTTs] = useState<string[]>(initialSelectedOTTs);
  const [classification, setClassification] = useState<string>("전체")
  const [sortType, setSortType] = useState<string>("최신순")
  const [searchWord, setSearchWord] = useState<string>("")


  return (
    <CommunityPageContainer>
      <HalfTextArea title={"커뮤니티"} content={"여러분들끼리 소통하는 공간입니다😘"}/>
      <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs} selectOnlyOne={false}/>
      <SmallGuide content={"아이콘을 클릭하여 원하는 정보를 확인하세요"}/>
      <CommunityButtonContainer>
        <CommunityPageButtons classification={classification} setClassification={setClassification}
                              sortType={sortType} setSortType={setSortType}
                              searchWord={searchWord} setSearchWord={setSearchWord}
        />
      </CommunityButtonContainer>
      <CommunityTableContainer>
        <CommunityPageTable classification={classification} sortType={sortType} searchWord={searchWord}
                            selectedOTTs={selectedOTTs}/>
      </CommunityTableContainer>

    </CommunityPageContainer>
  );
}

export default CommunityPage;