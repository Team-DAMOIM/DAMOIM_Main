import React from 'react';
import {HalfTextAreaContainer, HalfTextAreaContentContainer} from "./halfTextAreaStyles";


interface HalfTextAreaProps {
    title: string;
    content: string;
}

function HalfTextArea(props: HalfTextAreaProps) {
    const {title, content} = props;

    return (
        <HalfTextAreaContainer>
            <HalfTextAreaContentContainer>
                <span>{title}</span>
                <p>{content}</p>
            </HalfTextAreaContentContainer>
        </HalfTextAreaContainer>
    );
}

export default HalfTextArea;