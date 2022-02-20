import React, {useContext, useEffect, useState} from 'react';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField} from "@mui/material";
import HalfTextArea from "../../components/HalfTextArea/HalfTextArea";
import CreateIcon from "@mui/icons-material/Create";
import {
  EditCommunityPostPageContainer,
  EditCommunityPostPageInputContainer,
  EditCommunitySelectContainer
} from "./editCommunityPostStyles";
import {AuthContext} from "../../context/AuthContext";
import {
  addDoc, doc, documentId, getDocs, query, Timestamp, updateDoc, where
} from "firebase/firestore";
import {LoadingButton} from '@mui/lab';
import {useHistory, useParams} from "react-router-dom";
import {communityCollectionRef} from "../../firestoreRef/ref";
import TopCenterSnackBar from "../../components/TopCenterSnackBar/TopCenterSnackBar";
import useUserUID from "../../hooks/useUserUID";
import {postTypes} from "../../utils/types";
import {db} from "../../firebase-config";

function EditCommunityPost({edit}: { edit?: boolean }) {
  const history = useHistory();
  const {id} = useParams<{ id: string }>();
  const user = useContext(AuthContext)
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [classification, setClassification] = useState<string>("잡담")
  const [platform, setPlatform] = useState<string>("------")
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false)
  const [fail, setFail] = useState<boolean>(false)
  const userInfo = useUserUID(user);
  const [post, setPost] = useState<postTypes>()


  useEffect(() => {
    //편집모드에 해당하면 그 post 에 해당하는 정보들을 받아와줘야한다.
    if (edit) {
      const getPost = async () => {
        const q = await query(communityCollectionRef, where(documentId(), "==", id))
        const data = await getDocs(q);
        const tempPost = data.docs.map(doc => ({...doc.data(), id: doc.id}))[0] as postTypes

        // 기존의 정보들을 미리 화면에 그려줘야 유저가 그걸 바로 수정할수있습니다.
        setClassification(tempPost.classification)
        setPlatform(tempPost.platform)
        setTitle(tempPost.title)
        setContent(tempPost.content)
        setPost(tempPost)
      }
      getPost()
    }
  }, [edit])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value, name} = event.target;
    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "content":
        setContent(value);
        break;
      default:
        break
    }
  };

  const selectChangeHandler = (event: SelectChangeEvent) => {
    const {value, name} = event.target;
    switch (name) {
      case "classification":
        setClassification(value as string)
        break;
      case "platform":
        setPlatform(value as string)
        break;
      default:
        break;
    }
  }

  const postHandler = async () => {

    if (edit) {

      if (title.length >= 5 && content.length >= 10) {
        setLoading(true);
        await updateDoc(doc(db,"communityPosts",id),{
          title,
          content,
          classification,
          platform,
        })
        setLoading(false);
        setSuccess(true)

        setTimeout(() => {
          history.push('/community')
        }, 1000)
      } else {
        setFail(true);
      }
    } else {
      if (title.length >= 5 && content.length >= 10) {
        setLoading(true);
        await addDoc(communityCollectionRef, {
          writerUID: user?.uid,
          title,
          writerNickName: userInfo?.nickName,
          writerName: userInfo?.name,
          content,
          classification,
          platform,
          views: 0,
          loves: 0,
          createdAt: Timestamp.fromDate(new Date()),
        })
        setLoading(false);
        setSuccess(true)

        setTimeout(() => {
          history.push('/community')
        }, 1000)
      } else {
        setFail(true);
      }
    }
  }
  return (
    <>
      <EditCommunityPostPageContainer>

        <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"} content={edit ?"게시글 수정 성공했습니다 !" :"게시글 작성 성공했습니다 !"}/>
        <TopCenterSnackBar value={fail} setValue={setFail} severity={"error"} content={edit ?"양식에 맞게 글을 수정해주세요 !" :"양식에 맞게 글을 작성해주세요 !"}/>
        <HalfTextArea title={edit ? "글수정" : "글작성"} content={edit ? "글을 수정할 수 있습니다😎" : "OTT에 관해 소통해봐요😎"}/>
        <EditCommunitySelectContainer>
          <FormControl size={'small'}>
            <InputLabel id="demo-simple-select-label">분류</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={classification}
              label="classification"
              name="classification"
              onChange={selectChangeHandler}
            >
              <MenuItem value={"질문"}>질문</MenuItem>
              <MenuItem value={"잡담"}>잡담</MenuItem>
              <MenuItem value={"추천"}>추천</MenuItem>
            </Select>
          </FormControl>
          <FormControl size={'small'}>
            <InputLabel id="demo-simple-select-label">플랫폼</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={platform}
              label="platform"
              name="platform"
              onChange={selectChangeHandler}
            >
              <MenuItem value={"------"}>------</MenuItem>
              <MenuItem value={"넷플릭스"}>넷플릭스</MenuItem>
              <MenuItem value={"왓챠"}>왓챠</MenuItem>
              <MenuItem value={"웨이브"}>웨이브</MenuItem>
              <MenuItem value={"티빙"}>티빙</MenuItem>
              <MenuItem value={"디즈니플러스"}>디즈니플러스</MenuItem>
              <MenuItem value={"라프텔"}>라프텔</MenuItem>
              <MenuItem value={"애플TV"}>애플TV</MenuItem>
              <MenuItem value={"프라임비디오"}>프라임비디오</MenuItem>
              <MenuItem value={"윌라"}>윌라</MenuItem>
            </Select>
          </FormControl>
        </EditCommunitySelectContainer>
        <EditCommunityPostPageInputContainer>
          <TextField
            id="outlined-textarea"
            label="글 제목"
            placeholder="글 제목을 작성해주세요"
            multiline
            value={title}
            onChange={handleChange}
            fullWidth
            name="title"
            error={!(title.length === 0) && title.length < 5}
          />
          <TextField
            id="outlined-multiline-static"
            label="글 내용"
            placeholder="글 내용을 작성해주세요"
            multiline
            rows={15}
            fullWidth
            onChange={handleChange}
            value={content}
            name="content"
            error={!(content.length === 0) && content.length < 10}
          />
          <LoadingButton variant="contained" endIcon={<CreateIcon/>} onClick={postHandler}
                         loading={loading}>
            {edit ? "수정완료":"글쓰기"}
          </LoadingButton>
        </EditCommunityPostPageInputContainer>
      </EditCommunityPostPageContainer>

    </>
  );
}

export default EditCommunityPost;