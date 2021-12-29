import {useEffect, useState} from "react";
import {getDocs, query, where} from "firebase/firestore";
import {usersCollectionRef} from "../firestoreRef/ref";
import {User} from "@firebase/auth-types";


// user 정보를 받아서 user 의 이름을 반환해줍니다, 나중에는 유저의 프로필사진도 반환해줘야할수도있어요


const useUserUID = (user:User | null) => {
    const [userName, setUserName] = useState<string>("");
    useEffect(() => {
        const getUser = async () => {
            if (user) {
                const userQuery = await query(usersCollectionRef, where("uid", "==", user.uid))
                const data = await getDocs(userQuery);
                setUserName(data.docs.map(doc => ({...doc.data()}))[0].name);
            }
        }
        getUser();
    }, [])
    return userName
}
export default useUserUID