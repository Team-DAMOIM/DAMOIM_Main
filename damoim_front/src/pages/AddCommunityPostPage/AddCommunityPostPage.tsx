import React, {useContext, useState} from 'react';
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import HalfTextArea from "../../components/HalfTextArea/HalfTextArea";
import CreateIcon from "@mui/icons-material/Create";
import {
    AddCommunityPostPageContainer,
    AddCommunityPostPageInputContainer,
    AddCommunitySelectContainer
} from "./addCommunityPostPageStyles";
import {AuthContext} from "../../context/AuthContext";

function AddCommunityPostPage(props: any) {
    const user = useContext(AuthContext);
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [classfication, setClassfication] = useState<string>("잡담")
    const [platform, setPlatform] = useState<string>("------")

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
            case "classfication":
                setClassfication(value as string)
                break;
            case "platform":
                setPlatform(value as string)
                break;
            default:
                break;
        }
    }
    return (
        <AddCommunityPostPageContainer>
            <HalfTextArea title={"글작성"} content={"OTT에 관해 소통해봐요😎"}/>
            <AddCommunitySelectContainer>
                <FormControl size={'small'}>
                    <InputLabel id="demo-simple-select-label">분류</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={classfication}
                        label="classfication"
                        name="classfication"
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
                />
                <Button variant="contained" endIcon={<CreateIcon/>}>
                    글쓰기
                </Button>
            </AddCommunityPostPageInputContainer>
        </AddCommunityPostPageContainer>
    );
}

export default AddCommunityPostPage;