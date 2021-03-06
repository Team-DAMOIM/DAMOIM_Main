import {collection} from "firebase/firestore";
import {db} from "../firebase-config";

export const communityCollectionRef = collection(db, "communityPosts");
export const usersCollectionRef = collection(db, "users")
export const commentsCollectionRef = collection(db, "comments");
export const likesCollectionRef = collection(db, "likes");
export const disLikesCollectionRef = collection(db, "disLikes");
export const communityReportCollectionRef = collection(db, "communityReports");
export const partysCollectionRef = collection(db, "partys");
export const relationsCollectionRef = collection(db, "relations");
export const partyAcceptsCollectionRef = collection(db, "partyAccepts");
export const evaluationsCollectionRef = collection(db, "evaluations");