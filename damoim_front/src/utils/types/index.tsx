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