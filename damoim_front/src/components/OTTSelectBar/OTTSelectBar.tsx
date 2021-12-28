import React, {SetStateAction} from 'react';
import {OTTIconsContainer, OTTSelectBarContainer} from "./OTTSelectBarStyles";
import OTTIcon from "../OTTIcon/OTTIcon";
import netflixIcon from '../../assets/images/OTTIcons/netflixIcon.png'
import watchaIcon from '../../assets/images/OTTIcons/watchaIcon.png'
import wavveIcon from '../../assets/images/OTTIcons/wavveIcon.png'
import tvingIcon from '../../assets/images/OTTIcons/tvingIcon.jpg'
import disneyPlusIcon from '../../assets/images/OTTIcons/disneyPlusIcon.png'
import laftelIcon from '../../assets/images/OTTIcons/laftelIcon.png'
import appleTVIcon from '../../assets/images/OTTIcons/appleTVIcon.jpg'
import amazonIcon from '../../assets/images/OTTIcons/amazonIcon.png'
import welaaaIcon from '../../assets/images/OTTIcons/welaaaIcon.png'


interface OTTSelectBarProps {
    selectedOTTs: string[];
    setSelectedOTTs: React.Dispatch<SetStateAction<string[]>>;
    selectOnlyOne: boolean
}

function OTTSelectBar(props: OTTSelectBarProps) {

    const {selectedOTTs, setSelectedOTTs, selectOnlyOne} = props;
    const OTTs = [
        {
            img: netflixIcon,
            name: "netflix"
        },
        {
            img: disneyPlusIcon,
            name: "disneyPlus"
        },
        {
            img: watchaIcon,
            name: "watcha"
        },
        {
            img: wavveIcon,
            name: "wavve"
        },
        {
            img: tvingIcon,
            name: "tving"
        },
        {
            img: laftelIcon,
            name: "laftel"
        },
        {
            img: appleTVIcon,
            name: "appleTV"
        },
        {
            img: amazonIcon,
            name: "amazon"
        },
        {
            img: welaaaIcon,
            name: "welaaa"
        },
    ]


    return (
        <OTTSelectBarContainer>
            <OTTIconsContainer>
                {
                    OTTs.map(OTT => (
                        <OTTIcon img={OTT.img} key={OTT.name} name={OTT.name} selected={selectedOTTs.includes(OTT.name)}
                                 selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs} selectOnlyOne={selectOnlyOne}/>
                    ))
                }
            </OTTIconsContainer>
        </OTTSelectBarContainer>
    );
}

export default OTTSelectBar;