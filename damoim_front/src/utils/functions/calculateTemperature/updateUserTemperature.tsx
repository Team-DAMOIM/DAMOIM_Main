import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../../../firebase-config";

// 유저의 uid와 score를 받아 temperature를 갱신하는 함수
export const updateUserTemperature = async (uid: string, score: number) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let previousTemp: number = Number(docSnap.data().temperature);
    let newTemp: number = previousTemp + score;

    await updateDoc(docRef, {
      temperature: newTemp
    })
  } else {
    console.log("No such document!");
  }
}