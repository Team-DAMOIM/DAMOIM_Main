import React, {useState} from 'react';
import MainBanner from '../../components/MainBanner/MainBannerItem';
import OTTSelectBar from '../../components/OTTSelectBar/OTTSelectBar';
import PartyCard from '../../components/PartyCard/PartyCard';
import {HomePageContainer, PartyCardContainer} from "./homePageStyles";
import {RouteComponentProps} from "react-router-dom";
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";


type Props = RouteComponentProps;
const initialSelectedOTTs = ["netflix", "disneyPlus", "watcha", "wavve", "tving", "laftel", "appleTV", "amazon", "welaaa"];

const HomePage: React.FC<Props> = (props) => {

    console.log(props.location.state)
    const [userNotFound, setUserNotFound] = useState<boolean>(props.location.state !== undefined)
    const [selectedOTTs, setSelectedOTTs] = useState<string[]>(initialSelectedOTTs);

    return (
        <HomePageContainer>
            <MainBanner/>
            <OTTSelectBar selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs} selectOnlyOne={false}/>
            {/* 이 밑에 하드코딩된거 추후 수정 */}
            <PartyCardContainer>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(idx => {
                    return (
                        <PartyCard
                            id={`${idx}`}
                            OTTsNameArray={["netflix", "disneyPlus"]}
                            headerText='모집중'
                            temperature={40}
                            memberNum={2}
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