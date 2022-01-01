import React from 'react';
import {CardWithIconContainer, CardWithIconContentContainer} from "./cardWithIconStyles";
import {SvgIconTypeMap} from "@mui/material";
import {OverridableComponent} from "@mui/material/OverridableComponent";

interface CardWithIconTypes {
    title: string;
    content: string;
    icon:  any
}

function CardWithIcon({title, content, icon}: CardWithIconTypes) {
    return (
        <CardWithIconContainer>
            <CardWithIconContentContainer>
                <span>
                    {title}
                </span>
                <h4>
                    {content}
                </h4>
            </CardWithIconContentContainer>
            {
                icon
            }
        </CardWithIconContainer>
    );
}

export default CardWithIcon;