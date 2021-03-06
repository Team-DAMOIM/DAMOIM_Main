import React, {useContext, useEffect, useState} from 'react';
import {
  CommunityDetailPageContainer,
  CommunityDetailPageIconContainer,
  UserWithDetailContainer
} from "./communityDetailPageStyles";
import UserWithProfile from "../../components/UserWithProfile/UserWithProfile";
import CommunityPostDetail from "../../components/CommunityPostDetail/CommunityPostDetail";
import {Button, CardActions, CardContent, IconButton, Typography} from "@mui/material";
import Card from '@mui/material/Card';
import ShareIcon from '@mui/icons-material/Share';
import GppBadIcon from '@mui/icons-material/GppBad';
import Comment from "../../components/Comment/Comment";
import {getDocs, query, where, documentId, doc, updateDoc, orderBy, deleteDoc} from "firebase/firestore";
import {useHistory, useParams, Link} from "react-router-dom";
import {
  commentsCollectionRef,
  communityCollectionRef,
  usersCollectionRef
} from "../../firestoreRef/ref";
import {postTypes, SingleCommentTypesWithUser, userInfoTypes} from "../../utils/types";
import {Tag} from "antd";
import LikeDislikes from "../../components/LikeDislikes/LikeDislikes";
import {db} from "../../firebase-config";
import {useScript} from "../../hooks/useScript";
import ReportForm from "../../components/ReportForm/ReportForm";
import {AuthContext} from "../../context/AuthContext";
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";
import moment from "moment";
import 'moment/locale/ko';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {LoadingButton} from "@mui/lab";

declare global {
  interface Window {
    Kakao: any;
  }
}


function CommunityDetailPage() {
  const {id} = useParams<{ id: string }>()
  const [commentLists, setCommentLists] = useState<SingleCommentTypesWithUser[] | undefined>()
  const [post, setPost] = useState<postTypes | undefined>()
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [writerInfo, setWriterInfo] = useState<userInfoTypes>();
  const user = useContext(AuthContext);
  const [userNotFound, setUserNotFound] = useState<boolean>(false)
  const [openDeletePost, setOpenDeletePost] = useState<boolean>(false);
  const [deletePostLoading, setDeletePostLoading] = useState<boolean>(false);
  const history = useHistory();
  useEffect(() => {
    const getCommentList = async () => {
      const q = await query(commentsCollectionRef, where("postId", "==", id), orderBy("createdAt", 'desc'))
      const data = await getDocs(q);

      const tempComments = data.docs.map(doc => ({...doc.data(), id: doc.id})) as SingleCommentTypesWithUser[]
      let tempCommentsWithUser: SingleCommentTypesWithUser[] = []
      tempComments.map(async (comment) => {
        const getUserQuery = await query(usersCollectionRef, where(documentId(), "==", comment.writerUID))
        const user = await getDocs(getUserQuery);
        const userInformation = user.docs.map(doc => (doc.data()))[0] as userInfoTypes
        tempCommentsWithUser.push({
          ...comment,
          nickName: userInformation.nickName,
          avatar: userInformation.avatar,
          name: userInformation.name
        })
        if (tempComments.length === tempCommentsWithUser.length) {
          setCommentLists(tempCommentsWithUser)
        }
      })
    }
    getCommentList()
  }, [])

  useEffect(() => {
    const getPost = async () => {
      const q = await query(communityCollectionRef, where(documentId(), "==", id))
      const data = await getDocs(q);
      const tempPost = data.docs.map(doc => ({...doc.data(), id: doc.id}))[0] as postTypes
      setPost(tempPost)
      const communityDoc = doc(db, "communityPosts", tempPost.id);
      await updateDoc(communityDoc, {
        views: tempPost.views + 1
      })

      const userQuery = await query(usersCollectionRef, where("uid", "==", tempPost.writerUID))
      const userData = await getDocs(userQuery);
      setWriterInfo(userData.docs.map(doc => ({...doc.data()}))[0] as userInfoTypes);
    }
    getPost()
  }, [])


  const updateComment = (newComment: SingleCommentTypesWithUser) => {
    if (commentLists) {
      setCommentLists([...commentLists, newComment])
    } else {
      setCommentLists([newComment])
    }
  }

  const updateDeleteComment = (id:string) => {
    if (commentLists) {
      setCommentLists(commentLists.filter(comment => {
        return comment.id !== id
      }))
    }
  }

  const status = useScript("https://developers.kakao.com/sdk/js/kakao.js");
  // kakao sdk ???????????????
  // status??? ????????? ????????? ????????????, status??? ready??? ??? ???????????? ???????????????.
  useEffect(() => {
    if (status === "ready" && window.Kakao) {
      // ?????? initialization ??????
      if (!window.Kakao.isInitialized()) {
        // ????????? step ?????? ????????? javascript key ??? ???????????? initialize
        window.Kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);
      }
    }
  }, [status]);

  const handleKakaoButton = () => {
    window.Kakao.Link.sendScrap({
      requestUrl: "http://localhost:3000/communityDetail/p0oZJZwRDBwYQLuZ2Rbc",
    });
  };

  const deletePostHandler = async () => {

    setDeletePostLoading(true);
    // ?????? ???????????? ??????????????? ??? ???????????? ???????????? ???????????? ???????????????.
    const deleteCommentQuery = query(commentsCollectionRef, where("postId", "==", post?.id))
    const data = await getDocs(deleteCommentQuery)
    if (data.docs.length !== 0) {
      data.docs.map(async (doc) => {
        await deleteDoc(doc.ref)
      })
    }
    // ?????? id ??? ?????? ???????????? ???????????????.
    await deleteDoc(doc(db, "communityPosts", post?.id as string))

    setDeletePostLoading(false);
    setOpenDeletePost(false)

    // ????????? ????????? ???????????? ???????????? ???????????????
    history.push('/community')
  }

  const handleDeletePostClose = () => {
    setOpenDeletePost(false);
  };

  return (
    <CommunityDetailPageContainer>

      {post?.writerUID === user?.uid && <div className="modify-button-container">
        <Button onClick={() => {
          setOpenDeletePost(true)
        }
        } variant={"outlined"} startIcon={<DeleteIcon/>} color={"error"}>?????????</Button>
        <Link to={`/modifyCommunityPost/${post?.id}`}>
          <Button variant={"outlined"} startIcon={<EditIcon/>}>?????????</Button>
        </Link>
      </div>}

      {post && <> <Tag color="geekblue">{post.platform}</Tag> <Tag color="blue">{post.classification}</Tag>
        <h2>{post.title}</h2>
        <UserWithDetailContainer>
          <UserWithProfile
            uid={writerInfo?.uid as string}
            img={writerInfo?.avatar || "https://user-images.githubusercontent.com/69495129/150787523-d582c9ee-9852-43be-9abb-f4b330baef6d.png"}
            userName={writerInfo?.nickName as string || writerInfo?.name as string}/>
          <CommunityPostDetail views={post.views} loves={post.loves}
                               comments={commentLists ? commentLists.length : 0}
                               date={moment(post.createdAt.toDate()).format('YYYY??? MM??? DD??? HH??? MM???')}/>
        </UserWithDetailContainer>
        <Card raised={true}>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              {
                post.content
              }
            </Typography>
          </CardContent>
          <CardActions>
            <LikeDislikes post postId={post.id}/>
            <CommunityDetailPageIconContainer>
              <IconButton aria-label="share" onClick={handleKakaoButton}>
                <ShareIcon/>
              </IconButton>
              <IconButton aria-label="" onClick={() => {
                if (!user) {
                  setUserNotFound(true);
                  return;
                }
                setReportOpen(true)
              }}>
                <GppBadIcon/>
              </IconButton>
            </CommunityDetailPageIconContainer>
          </CardActions>
        </Card>
        <Comment postId={post.id} commentLists={commentLists}
                 refreshFunction={updateComment} updateDeleteComment={updateDeleteComment}/>

        <ReportForm reportOpen={reportOpen} setReportOpen={setReportOpen} postId={id}/>
        <TopCenterSnackBar value={userNotFound} setValue={setUserNotFound} severity={"error"}
                           content={"????????? ??? ?????? ?????????????????? !"}/>

      </>}

      {/*???????????? ?????? ?????????????????? modal ?????????.*/}
      <Dialog
        open={openDeletePost}
        onClose={handleDeletePostClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"????????? ???????????? ?????????????????????????"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ?????? ???????????? ????????? ??????????????????.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeletePostClose}>??????</Button>
          <LoadingButton loading={deletePostLoading} onClick={deletePostHandler} autoFocus>
            ?????????????????????.
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </CommunityDetailPageContainer>
  );
}

export default CommunityDetailPage;