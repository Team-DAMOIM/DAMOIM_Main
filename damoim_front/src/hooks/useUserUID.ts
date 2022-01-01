import {useEffect, useState} from "react";
import {getDocs, query, Timestamp, where} from "firebase/firestore";
import {usersCollectionRef} from "../firestoreRef/ref";
import {User} from "@firebase/auth-types";


// user 정보를 받아서 에 대한 모든 정보를 반환해줍니다


interface userInfoTypes {
    uid : string;
    name:string;
    nickName:string;
    isOnline:false;
    email:string;
    createdAt: Timestamp;
    avatar:string;
    avatarPath:string;
}

const useUserUID = (user:User | null) => {
    const [userInfo, setUserInfo] = useState<userInfoTypes>();
    useEffect(() => {
        const getUser = async () => {
            if (user) {
                const userQuery = await query(usersCollectionRef, where("uid", "==", user.uid))
                const data = await getDocs(userQuery);
                setUserInfo(data.docs.map(doc => ({...doc.data()}))[0] as userInfoTypes);
            }
        }
        getUser();
    }, [])
    return userInfo
}
export default useUserUID