import React, {SetStateAction} from 'react';
import {OTTIconsContainer, OTTSelectBarContainer} from "./OTTSelectBarStyles";
import OTTIcon from "../OTTIcon/OTTIcon";
import netflixIcon from '../../assets/images/OTTIcons/netflixIcon.png'
import watchaIcon from '../../assets/images/OTTIcons/watchaIcon.png'
import wavveIcon from '../../assets/images/OTTIcons/wavveIcon.png'
import tvingIcon from '../../assets/images/OTTIcons/tvingIcon.jpg'
import disneyIcon from '../../assets/images/OTTIcons/disneyPlusIcon.png'
import laftelIcon from '../../assets/images/OTTIcons/laftelIcon.png'

interface OTTSelectBarProps {
    selectedOTTs: string[];
    setSelectedOTTs: React.Dispatch<SetStateAction<string[]>>;
}

function OTTSelectBar(props: OTTSelectBarProps) {

    const {selectedOTTs, setSelectedOTTs} = props;

    const OTTs = [
        {
            img: netflixIcon,
            name: "netflix"
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
            img: disneyIcon,
            name: "disney"
        },
        {
            img: laftelIcon,
            name: "laftel"
        }
    ]


    return (
        <OTTSelectBarContainer>
            <OTTIconsContainer>
                {
                    OTTs.map(OTT => (
                        <OTTIcon img={OTT.img} key={OTT.name} name={OTT.name}  selected={selectedOTTs.includes(OTT.name)} selectedOTTs={selectedOTTs} setSelectedOTTs={setSelectedOTTs}/>
                    ))
                }
            </OTTIconsContainer>
        </OTTSelectBarContainer>
    );
}

export default OTTSelectBar;