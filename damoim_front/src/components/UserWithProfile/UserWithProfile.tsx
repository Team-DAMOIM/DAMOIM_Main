import React, {useContext} from 'react';
import {UserWithProfileContainer} from "./userWithProfileStyles";
import {AuthContext} from "../../context/AuthContext";

interface UserWithProfileProps {
    uid: string,
    img: string,
    userName: string
}

function UserWithProfile({img, userName, uid}: UserWithProfileProps) {
    const me = useContext(AuthContext);




    return (
        <UserWithProfileContainer to={me?.uid === uid ? `/userPage/${uid}`: `/otherUserPage/${uid}`}>
            <img src={img} alt={img}/>
            <span>
                {userName}
            </span>
        </UserWithProfileContainer>
    );
}

export default UserWithProfile;