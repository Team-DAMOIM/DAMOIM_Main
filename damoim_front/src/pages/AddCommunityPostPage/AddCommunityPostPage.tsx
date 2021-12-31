import React, {useContext, useEffect, useState} from 'react';
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField} from "@mui/material";
import HalfTextArea from "../../components/HalfTextArea/HalfTextArea";
import CreateIcon from "@mui/icons-material/Create";
import {
    AddCommunityPostPageContainer,
    AddCommunityPostPageInputContainer,
    AddCommunitySelectContainer
} from "./addCommunityPostPageStyles";
import {AuthContext} from "../../context/AuthContext";
import {auth, db} from "../../firebase-config";
import {
    addDoc, Timestamp, doc, updateDoc, query, where, getDocs
} from "firebase/firestore";
import Alert from '@mui/material/Alert';
import {LoadingButton} from '@mui/lab';
import {useHistory} from "react-router-dom";
import {signOut} from "firebase/auth";
import {communityCollectionRef, usersCollectionRef} from "../../firestoreRef/ref";
import useUserUID from "../../hooks/useUserUID";

function AddCommunityPostPage() {
    const user = useContext(AuthContext);
    const history = useHistory();
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [classification, setClassification] = useState<string>("잡담")
    const [platform, setPlatform] = useState<string>("------")
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false)
    const [fail, setFail] = useState<boolean>(false)

    const userName = useUserUID(user);





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

    const addPostHandler = async () => {
        if (user && title.length >= 5 && content.length >= 10) {
            setLoading(true);
            await addDoc(communityCollectionRef, {
                writerUID: user.uid,
                writerName:userName,
                title,
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
            }, 2000)
        } else {
            setFail(true);
        }
    }

    return (
      user ? (
        <AddCommunityPostPageContainer>
            <Snackbar open={success} autoHideDuration={2000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                      onClose={() => {
                          setSuccess(false);
                      }}>
                <Alert severity="success" sx={{width: '100%'}}>
                    게시글 작성 성공했습니다!
                </Alert>
            </Snackbar>
            <Snackbar open={fail} autoHideDuration={2000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                      onClose={() => {
                          setFail(false);
                      }}>
                <Alert severity="error" sx={{width: '100%'}}>
                    양식에 맞게 글을 작성해주세요
                </Alert>
            </Snackbar>
            <HalfTextArea title={"글작성"} content={"OTT에 관해 소통해봐요😎"}/>
            <AddCommunitySelectContainer>
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
            </AddCommunitySelectContainer>
            <AddCommunityPostPageInputContainer>
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
                <LoadingButton variant="contained" endIcon={<CreateIcon/>} onClick={addPostHandler} loading={loading}>
                    글쓰기
                </LoadingButton>
            </AddCommunityPostPageInputContainer>

        </AddCommunityPostPageContainer>
      ) : <Alert severity="error" sx={{width: '100%'}}>로그인 먼저 해주세요!</Alert>
    );
}

export default AddCommunityPostPage;