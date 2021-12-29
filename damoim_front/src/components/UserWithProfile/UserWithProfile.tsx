import React from 'react';
import {UserWithProfileContainer} from "./userWithProfileStyles";

interface UserWithProfileProps {
    img: string,
    userName: string
}

function UserWithProfile(props: UserWithProfileProps) {
    const {img , userName} = props;
    return (
        <UserWithProfileContainer>
            <img src={img} alt={img}/>
            <span>
                {userName}
            </span>
        </UserWithProfileContainer>
    );
}

export default UserWithProfile;