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

  const status = useScript("https://developers.kakao.com/sdk/js/kakao.js");
  // kakao sdk 초기화하기
  // status가 변경될 때마다 실행되며, status가 ready일 때 초기화를 시도합니다.
  useEffect(() => {
    if (status === "ready" && window.Kakao) {
      // 중복 initialization 방지
      if (!window.Kakao.isInitialized()) {
        // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
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
    // 해당 포스트가 지워지면서 그 포스트에 해당하는 댓글들도 지워줍니다.
    const deleteCommentQuery = query(commentsCollectionRef, where("postId", "==", post?.id))
    const data = await getDocs(deleteCommentQuery)
    if (data.docs.length !== 0) {
      data.docs.map(async (doc) => {
        await deleteDoc(doc.ref)
      })
    }
    // 해당 id 에 맞는 포스트를 지워줍니다.
    await deleteDoc(doc(db, "communityPosts", post?.id as string))

    setDeletePostLoading(false);
    setOpenDeletePost(false)

    // 삭제가 끝나면 커뮤니티 페이지로 보내줍니다
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
        } variant={"outlined"} startIcon={<DeleteIcon/>} color={"error"}>글삭제</Button>
        <Link to={`/modifyCommunityPost/${post?.id}`}>
          <Button variant={"outlined"} startIcon={<EditIcon/>}>글수정</Button>
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
                               date={moment(post.createdAt.toDate()).format('YYYY년 MM월 DD일 HH시 MM분')}/>
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
                 refreshFunction={updateComment}/>

        <ReportForm reportOpen={reportOpen} setReportOpen={setReportOpen} postId={id}/>
        <TopCenterSnackBar value={userNotFound} setValue={setUserNotFound} severity={"error"}
                           content={"로그인 후 다시 이용해주세요 !"}/>

      </>}

      {/*게시글을 진짜 삭제할거냐는 modal 입니다.*/}
      <Dialog
        open={openDeletePost}
        onClose={handleDeletePostClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"정말로 게시글을 삭제하시겠습니까?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            글을 삭제하면 복구가 불가능합니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeletePostClose}>취소</Button>
          <LoadingButton loading={deletePostLoading} onClick={deletePostHandler} autoFocus>
            삭제하겠습니다.
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </CommunityDetailPageContainer>
  );
}

export default CommunityDetailPage;