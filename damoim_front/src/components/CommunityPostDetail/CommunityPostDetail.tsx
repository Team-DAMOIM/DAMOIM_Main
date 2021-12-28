import React from 'react';
import {CommunityPostDetailContainer} from "./CommunityPostDetailStyles";

interface CommunityPostDetailProps {
    views:number;
    loves:number;
    comments:number;
    date:string
}

function CommunityPostDetail(props:CommunityPostDetailProps) {
    const {views,loves,comments,date} = props;
    return (
        <CommunityPostDetailContainer>
            <span>조회 수 </span>{views}  |
            <span>추천 수 </span>{loves}  |
            <span>댓글  </span>{comments}  |
            <span>  {date} </span>

        </CommunityPostDetailContainer>
    );
}

export default CommunityPostDetail;