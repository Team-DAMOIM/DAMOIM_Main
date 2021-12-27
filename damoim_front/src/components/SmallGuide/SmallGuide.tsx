import React from 'react';
import {SmallGuideContainer} from "./SmallGuideStyles";


interface SmallGuideProps {
    content:string;
}

function SmallGuide(props:SmallGuideProps) {
    const {content} = props;
    return (
        <SmallGuideContainer>
            {content}
        </SmallGuideContainer>
    );
}

export default SmallGuide;