import React, {useEffect, useState} from 'react';
import {RankingPageContainer} from "./rankingPageStyles";
import OTTSelectBar from "../../components/OTTSelectBar/OTTSelectBar";
import SmallGuide from "../../components/SmallGuide/SmallGuide";
import HalfTextArea from "../../components/HalfTextArea/HalfTextArea";
import axios from "axios";

const initialSelectedOTTs = ["netflix"]

function RankingPage(props: any) {
    const [selectedOTTs, setSelectedOTTs] = useState<string[]>(initialSelectedOTTs);

    useEffect(() => {
        axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'origin': "https://m.kinolights.com"
            },
            url: 'https://api.kinolights.com/v2/rank/daily',
        }).then(function (response) {
            console.log(response.data);
        });
    }, [])

    return (
        <RankingPageContainer>
            <HalfTextArea title={"순위"} content={"OTT별 오늘의 영상 순위를 확인할 수 있습니다😘"}/>
            <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs} selectOnlyOne/>
            <SmallGuide content={"아이콘을 클릭하여 원하는 정보를 확인하세요"}/>
        </RankingPageContainer>
    );
}

export default RankingPage;