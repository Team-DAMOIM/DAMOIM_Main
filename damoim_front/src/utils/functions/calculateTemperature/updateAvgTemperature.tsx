import {doc, DocumentData, documentId, getDocs, Query, query, updateDoc, where} from "firebase/firestore";
import {partysCollectionRef} from "../../../firestoreRef/ref";
import {partyTypes} from "../../types";
import {db} from "../../../firebase-config";


// 어떤 사람의 uid와 점수를 받으면 해당 사람이 가입한 모든 파티의 평균 온도를 갱신하는 함수 (+ exceptPartyID는 갱신하지 말아야 할 party가 있을 경우 사용할 수 있다.)
export const updateAvgTemperature = async (uid: string, score: number, exceptPartyID: string | null) => {
  let q: Query<DocumentData>;
  if (exceptPartyID) {
    q = query(partysCollectionRef, where("memberUIDs", "array-contains", uid), where(documentId(), "!=", exceptPartyID));
  } else {
    q = query(partysCollectionRef, where("memberUIDs", "array-contains", uid));
  }

  const data = await getDocs(q);

  if (data.docs.length !== 0) {
    let userPartys: partyTypes[] = data.docs.map(doc => ({...doc.data(), id: doc.id}) as partyTypes); // 받은 uid의 가입된 파티들에 대한 배열

    userPartys.map(party => {
      const updatePartyAvgTemp = async () => {
        const docRef = doc(db, "partys", party.id);

        let newAvgTemp = Math.round( ((party.avgTemperature * party.memberUIDs.length + score) / party.memberUIDs.length) ) // 반올림

        await updateDoc(docRef, {
          avgTemperature: newAvgTemp
        })
      }

      updatePartyAvgTemp();
    })
  } else {
    console.log("가입된 파티가 없음.")
  }
}