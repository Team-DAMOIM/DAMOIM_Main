import React, {useState} from 'react';

import {
    CommunityButtonContainer,
    CommunityLeftButtonContainer,
    CommunityPageContainer,
    CommunityRightButtonContainer
} from "./communityPageStyles";
import OTTSelectBar from "../../components/OTTSelectBar/OTTSelectBar";
import HalfTextArea from "../../components/HalfTextArea/HalfTextArea";
import SmallGuide from "../../components/SmallGuide/SmallGuide";
import {Button} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';

const initialSelectedOTTs = ["netflix", "watcha", "wavve", "tving", "disney", "laftel"]

function CommunityPage(props: any) {
    // ["netflix","watcha"] <- 넷플릭스와 왓챠가 선택되었다면
    const [selectedOTTs, setSelectedOTTs] = useState<string[]>(initialSelectedOTTs);

    return (
        <CommunityPageContainer>
            <HalfTextArea title={"커뮤니티"} content={"여러분들끼리 소통하는 공간입니다😘"}/>
            <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs}/>
            <SmallGuide content={"아이콘을 클릭하여 원하는 정보를 확인하세요"}/>
            <CommunityButtonContainer>
                <CommunityLeftButtonContainer>
                    <Button variant="contained" endIcon={<FilterListIcon/>}>
                        분류
                    </Button>
                    <Button variant="contained" endIcon={<SortIcon/>}>
                        정렬
                    </Button>
                </CommunityLeftButtonContainer>
                <CommunityRightButtonContainer>
                    <Button variant="contained" endIcon={<CreateIcon/>}>
                        글쓰기
                    </Button>
                    <Button variant="contained" endIcon={<SearchIcon/>}>
                        검색
                    </Button>
                </CommunityRightButtonContainer>
            </CommunityButtonContainer>
        </CommunityPageContainer>
    );
}

export default CommunityPage;