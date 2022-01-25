import {useEffect, useState} from "react";
import {getDocs, query, Timestamp, where} from "firebase/firestore";
import {usersCollectionRef} from "../firestoreRef/ref";
import {User} from "@firebase/auth-types";
import {userInfoTypes} from "../utils/types";


// user 정보를 받아서 에 대한 모든 정보를 반환해줍니다




const useOnlyUserUID = (uid:string) => {
  const [userInfo, setUserInfo] = useState<userInfoTypes>();
  useEffect(() => {
    const getUser = async () => {
        const userQuery = await query(usersCollectionRef, where("uid", "==", uid))
        const data = await getDocs(userQuery);
        setUserInfo(data.docs.map(doc => ({...doc.data()}))[0] as userInfoTypes);
    }
    getUser();
  }, [uid])
  return userInfo
}
export default useOnlyUserUID