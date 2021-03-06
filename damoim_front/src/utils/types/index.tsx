import {Timestamp} from "firebase/firestore";

export interface SingleCommentTypes {
  id: string;
  content: string;
  createdAt: Timestamp;
  postId: string;
  writerName: string;
  writerUID: string;
  responseTo: string;
}

export interface postTypes {
  id: string;
  classification: string;
  content: string;
  createdAt: Timestamp;
  loves: number;
  platform: string;
  title: string;
  views: number;
  writerUID: string
}

export interface userInfoTypes {
  uid: string;
  name: string;
  nickName: string;
  isOnline: false;
  email: string;
  createdAt: Timestamp;
  avatar: string;
  avatarPath: string;
  temperature: number;
  joinPeriod: number;
}

export interface SingleCommentTypesWithUser extends SingleCommentTypes, userInfoTypes {

}

export interface partyTypes {
  id: string;
  hostUID: string;
  memberUIDs: string[];
  openChatLink: string;
  selectedOTTs: string[];
  startDate: Timestamp;
  wishPeriod: number;
  createdAt: Timestamp;
  memberTalk: string;
  avgTemperature: number;
  state: string;
  activeDate: Timestamp;
}

export interface relationTypes {
  member1: string;
  member2: string;
  state: string;
  createdAt: Timestamp;
}

export interface partyAcceptTypes {
  id: string;
  applicant: string;
  master: string;
  partyId: string;
  partyJoinTalk: string;
  state: string;
  avatar?:string;
  nickName?:string;
  temperature:number;
  createdAt: Timestamp
}