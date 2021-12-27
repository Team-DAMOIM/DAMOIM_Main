import React, {SetStateAction, useState} from 'react';
import {
    CommunityLeftButtonContainer,
    CommunityRightButtonContainer, CommunityRightOnlyButtonContainer,
    CommunitySearchWordContainer
} from "./communityPageStyles";
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from "@mui/icons-material/Search";


interface CommunityPageButtonsProps {
    classfication: string;
    setClassfication: React.Dispatch<SetStateAction<string>>;
    sortType: string;
    setSortType: React.Dispatch<SetStateAction<string>>;
    searchWord: string;
    setSearchWord: React.Dispatch<SetStateAction<string>>;
}


function CommunityPageButtons(props: CommunityPageButtonsProps) {

    const {classfication, setClassfication, sortType, setSortType, searchWord, setSearchWord} = props;
    const [showSearchBar,setShowSearchBar] = useState<boolean>(false)



    const selectChangeHandler = (event: SelectChangeEvent) => {
        const {value, name} = event.target;
        switch (name) {
            case "classfication":
                setClassfication(value as string)
                break;
            case "sortType":
                setSortType(value as string)
                break;
            default:
                break;
        }
    }

    return (
        <>
            <CommunityLeftButtonContainer>
                <FormControl size={'small'} fullWidth>
                    <InputLabel id="demo-simple-select-label">분류</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={classfication}
                        label="classfication"
                        name="classfication"
                        onChange={selectChangeHandler}
                    >
                        <MenuItem value={"전체"}>전체</MenuItem>
                        <MenuItem value={"질문"}>질문</MenuItem>
                        <MenuItem value={"잡담"}>잡담</MenuItem>
                        <MenuItem value={"공지"}>공지</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size={'small'} fullWidth>
                    <InputLabel id="demo-simple-select-label">정렬</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sortType}
                        label="sortType"
                        name="sortType"
                        onChange={selectChangeHandler}
                    >
                        <MenuItem value={"최신순"}>최신순</MenuItem>
                        <MenuItem value={"조회순"}>조회순</MenuItem>
                        <MenuItem value={"추천순"}>추천순</MenuItem>
                        <MenuItem value={"댓글순"}>댓글순</MenuItem>
                    </Select>
                </FormControl>
            </CommunityLeftButtonContainer>
            <CommunityRightButtonContainer>
                <CommunityRightOnlyButtonContainer>
                    <Button variant="contained" endIcon={<CreateIcon/>}>
                        글쓰기
                    </Button>
                    <Button variant="contained" endIcon={<SearchIcon/>}
                        onClick={()=>{
                            setShowSearchBar(!showSearchBar)
                        }}
                    >
                        검색
                    </Button>
                </CommunityRightOnlyButtonContainer>
                {showSearchBar && <CommunitySearchWordContainer>
                    <TextField id="standard-basic" label="검색어를 입력해주세요" variant="standard"/>
                </CommunitySearchWordContainer>}
            </CommunityRightButtonContainer>

        </>

    );
}

export default CommunityPageButtons;