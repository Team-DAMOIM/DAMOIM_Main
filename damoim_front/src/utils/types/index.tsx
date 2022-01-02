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
    writerName: string;
    writerUID: string
}

export interface userInfoTypes {
    uid : string;
    name:string;
    nickName:string;
    isOnline:false;
    email:string;
    createdAt: Timestamp;
    avatar:string;
    avatarPath:string;
}