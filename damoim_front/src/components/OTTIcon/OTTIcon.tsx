import React, {SetStateAction} from 'react';
import {OTTIconContainer} from "./OTTIconStyles";

interface OTTIconProps {
    img: string,
    name: string,
    selected: boolean
    selectedOTTs: string[]
    setSelectedOTTs: React.Dispatch<SetStateAction<string[]>>;
}

function OTTIcon(props: OTTIconProps) {

    const {img, name, selected, selectedOTTs, setSelectedOTTs} = props

    const iconClickHandler = () => {
        let arr: string[] = []
        if (selectedOTTs.includes(name)) {
            arr = selectedOTTs.filter(selectedOTT => selectedOTT != name)
            setSelectedOTTs(arr);
        } else {
            setSelectedOTTs([...selectedOTTs, name])
        }

    }
    return (
        <OTTIconContainer selected={selected} onClick={iconClickHandler}>
            <img src={img}/>
        </OTTIconContainer>
    );
}

export default OTTIcon;