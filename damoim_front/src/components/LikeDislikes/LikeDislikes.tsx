import React, {useContext, useEffect, useState} from 'react'
import {Tooltip} from 'antd';
import {DislikeOutlined, LikeOutlined, LikeFilled, DislikeFilled} from "@ant-design/icons";
import {AuthContext} from "../../context/AuthContext";
import {addDoc, getDocs, Query, query, where, deleteDoc, doc, updateDoc} from "firebase/firestore";
import {disLikesCollectionRef, likesCollectionRef} from "../../firestoreRef/ref";
import {db} from "../../firebase-config";

interface LikeDislikesTypes {
    post?: boolean;
    comment?: boolean;
    postId?: string;
    commentId?: string;
}

interface likeDislikesCollectionTypes {
    id: string;
    postId?: string;
    commentId?: string;
    userUID: string;
}

function LikeDislikes({post, postId, commentId}: LikeDislikesTypes) {
    const user = useContext(AuthContext);

    const [likes, setLikes] = useState(0)
    const [disLikes, setDisLikes] = useState(0)
    const [likeAction, setLikeAction] = useState<string | null>(null)
    const [disLikeAction, setDisLikeAction] = useState<string | null>(null)


    // 기존의 좋아요와 싫어요 개수를 가져오는 useEffect 입니다.

    useEffect(() => {
        const getLike = async () => {
            let getLikeQuery: Query
            if (post) {
                getLikeQuery = await query(likesCollectionRef, where("postId", "==", postId))
            } else {
                getLikeQuery = await query(likesCollectionRef, where("commentId", "==", commentId))
            }
            const data = await getDocs(getLikeQuery);
            const likeList = data.docs.map((doc) => ({...doc.data(), id: doc.id})) as likeDislikesCollectionTypes[]
            setLikes(likeList.length)
            likeList.map((like) => {
                if (like.userUID === user?.uid) {
                    setLikeAction('liked');
                }
            })

        }
        const getDisLike = async () => {
            let getDisLikeQuery: Query
            if (post) {
                getDisLikeQuery = await query(disLikesCollectionRef, where("postId", "==", postId))
            } else {
                getDisLikeQuery = await query(disLikesCollectionRef, where("commentId", "==", commentId))
            }
            const data = await getDocs(getDisLikeQuery);
            const disLikeList = data.docs.map((doc) => ({...doc.data(), id: doc.id})) as likeDislikesCollectionTypes[]
            setDisLikes(disLikeList.length)
            disLikeList.map((disLike) => {
                if (disLike.userUID === user?.uid) {
                    setDisLikeAction('disLiked');
                }
            })

        }
        getLike();
        getDisLike();
    }, [])


    // 이미 좋아요를 누르지 않았단 사실은 확실하다 , 싫어요는 눌렀는지 모르지만 dislikes collection 에서 찾아서 지워버리자 postId 와 userUID 가 같이 겹치는게 있다면
    const onLike = async () => {
        if (likeAction === null) {
            setLikes(likes + 1);
            setLikeAction("liked")
            if (post) {
                const communityDoc = doc(db, "communityPosts", postId as string);
                await addDoc(likesCollectionRef, {
                    postId: postId,
                    userUID: user?.uid
                })

                await updateDoc(communityDoc, {
                    loves: likes + 1
                })

            } else {
                await addDoc(likesCollectionRef, {
                    commentId: commentId,
                    userUID: user?.uid
                })
            }


            if (disLikeAction !== null) {
                let searchQuery: Query;
                setDisLikes(disLikes - 1)
                setDisLikeAction(null)
                if (post) {
                    searchQuery = await query(disLikesCollectionRef, where("postId", "==", postId), where("userUID", "==", user?.uid));
                } else {
                    searchQuery = await query(disLikesCollectionRef, where("commentId", "==", commentId), where("userUID", "==", user?.uid));
                }

                const data = await getDocs(searchQuery);
                const deleteId = data.docs.map((doc) => ({...doc.data(), id: doc.id}))[0].id
                await deleteDoc(doc(db, "disLikes", deleteId))

            }


        } else {     // 좋아요를 눌렀는데 또 좋아요를 눌른다? 그럼 좋아요에서 찾아서 지워주자
            setLikes(likes - 1)
            setLikeAction(null)
            let searchQuery: Query;
            const communityDoc = doc(db, "communityPosts", postId as string);
            if (post) {
                searchQuery = await query(likesCollectionRef, where("postId", "==", postId), where("userUID", "==", user?.uid));
            } else {
                searchQuery = await query(likesCollectionRef, where("commentId", "==", commentId), where("userUID", "==", user?.uid));
            }
            const data = await getDocs(searchQuery);
            const deleteId = data.docs.map((doc) => ({...doc.data(), id: doc.id}))[0].id
            await deleteDoc(doc(db, "likes", deleteId))
            if (post) {
                await updateDoc(communityDoc, {
                    loves: likes - 1
                })
            }

        }
    }


    const onDisLike = async () => {
        if (disLikeAction === null) {
            setDisLikes(disLikes + 1);
            setDisLikeAction("disLiked")
            if (post) {
                await addDoc(disLikesCollectionRef, {
                    postId: postId,
                    userUID: user?.uid
                })
            } else {
                await addDoc(disLikesCollectionRef, {
                    commentId: commentId,
                    userUID: user?.uid
                })
            }


            if (likeAction !== null) {
                setLikes(likes - 1)
                setLikeAction(null)
                let searchQuery: Query;
                const communityDoc = doc(db, "communityPosts", postId as string);
                if (post) {
                    searchQuery = await query(likesCollectionRef, where("postId", "==", postId), where("userUID", "==", user?.uid));
                } else {
                    searchQuery = await query(likesCollectionRef, where("commentId", "==", commentId), where("userUID", "==", user?.uid));
                }

                const data = await getDocs(searchQuery);
                const deleteId = data.docs.map((doc) => ({...doc.data(), id: doc.id}))[0].id
                await deleteDoc(doc(db, "likes", deleteId))
                if (post) {
                    await updateDoc(communityDoc, {
                        loves: likes - 1
                    })
                }

            }


        } else {     // 싫어요를 눌렀는데 또 싫어요 눌른다? 그럼 싫어요에서 찾아서 지워주자
            setDisLikes(disLikes - 1)
            setDisLikeAction(null)
            let searchQuery: Query;
            if (post) {
                searchQuery = await query(disLikesCollectionRef, where("postId", "==", postId), where("userUID", "==", user?.uid));
            } else {
                searchQuery = await query(disLikesCollectionRef, where("commentId", "==", commentId), where("userUID", "==", user?.uid));
            }
            const data = await getDocs(searchQuery);
            const deleteId = data.docs.map((doc) => ({...doc.data(), id: doc.id}))[0].id
            await deleteDoc(doc(db, "disLikes", deleteId))

        }
    }


    return (
        <React.Fragment>
            <span key="comment-basic-like">

                <Tooltip title="Like">
                    {
                        likeAction === "liked" ?
                            <LikeFilled type="like" style={{color: 'black'}} onClick={onLike}/>
                            : <LikeOutlined type="like" style={{color: 'black'}} onClick={onLike}/>
                    }
                </Tooltip>
                <span style={{paddingLeft: '8px', cursor: 'auto', color: 'black'}}>{likes}</span>
            </span>&nbsp;&nbsp;
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    {
                        disLikeAction === "disLiked" ?
                            <DislikeFilled type="dislike" style={{color: 'black'}} onClick={onDisLike}/> :
                            <DislikeOutlined type="dislike" style={{color: 'black'}} onClick={onDisLike}/>
                    }

                </Tooltip>
                <span style={{paddingLeft: '8px', cursor: 'auto', color: 'black'}}>{disLikes}</span>
            </span>
        </React.Fragment>
    )
}

export default LikeDislikes