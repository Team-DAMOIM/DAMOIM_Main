import React, {SetStateAction, useState} from 'react';
import {OTTIconContainer} from "./OTTIconStyles";
import {initialSelectedOTTs} from "../../utils/variables";

interface OTTIconProps {
    img: string,
    name: string,
    selected: boolean
    selectedOTTs: string[]
    setSelectedOTTs: React.Dispatch<SetStateAction<string[]>>;
    selectOnlyOne: boolean
}

function OTTIcon({img, name, selected, selectedOTTs, setSelectedOTTs, selectOnlyOne}: OTTIconProps) {

    const iconClickHandler = () => {
        let arr: string[] = [];
        if (!selectOnlyOne) {
            if (selectedOTTs.length === initialSelectedOTTs.length) {
                setSelectedOTTs([name]);
            } else if (selectedOTTs.includes(name)) {
                arr = selectedOTTs.filter(selectedOTT => selectedOTT != name);
                setSelectedOTTs(arr);
            } else {
                setSelectedOTTs([...selectedOTTs, name]);
            }
        } else {
            setSelectedOTTs([name]);
        }
    }
    return (
        <OTTIconContainer selected={selected} onClick={iconClickHandler}>
            <img src={img}/>
        </OTTIconContainer>
    );
}

export default OTTIcon;