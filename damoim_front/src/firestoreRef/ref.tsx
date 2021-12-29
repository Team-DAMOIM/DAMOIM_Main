import {collection} from "firebase/firestore";
import {db} from "../firebase-config";

export const communityCollectionRef = collection(db, "communityPosts");
export const usersCollectionRef = collection(db, "users")
export const commentsCollectionRef = collection(db, "comments");
