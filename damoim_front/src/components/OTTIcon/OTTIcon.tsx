import React, {SetStateAction} from 'react';
import {OTTIconContainer} from "./OTTIconStyles";

interface OTTIconProps {
    img: string,
    name: string,
    selected: boolean
    selectedOTTs: string[]
    setSelectedOTTs: React.Dispatch<SetStateAction<string[]>>;
    selectOnlyOne: boolean
}

function OTTIcon(props: OTTIconProps) {

    const {img, name, selected, selectedOTTs, setSelectedOTTs, selectOnlyOne} = props;

    const iconClickHandler = () => {
        let arr: string[] = [];
        if (!selectOnlyOne) {
            if (selectedOTTs.includes(name)) {
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