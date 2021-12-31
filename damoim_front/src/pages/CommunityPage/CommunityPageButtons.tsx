import React, {SetStateAction, useContext, useState} from 'react';
import {
    CommunityLeftButtonContainer,
    CommunityRightButtonContainer, CommunityRightOnlyButtonContainer,
    CommunitySearchWordContainer
} from "./communityPageStyles";
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from "@mui/icons-material/Search";
import {Link} from 'react-router-dom'
import {classificationLabels, sortTypesLabels} from "../../utils/variables";
import {AuthContext} from "../../context/AuthContext";


interface CommunityPageButtonsProps {
    classification: string;
    setClassification: React.Dispatch<SetStateAction<string>>;
    sortType: string;
    setSortType: React.Dispatch<SetStateAction<string>>;
    searchWord: string;
    setSearchWord: React.Dispatch<SetStateAction<string>>;
}


function CommunityPageButtons(props: CommunityPageButtonsProps) {

    const user = useContext(AuthContext);

    const {classification, setClassification, sortType, setSortType, setSearchWord} = props;
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false)

    const selectChangeHandler = (event: SelectChangeEvent) => {
        const {value, name} = event.target;
        switch (name) {
            case "classification":
                setClassification(value as string)
                break;
            case "sortType":
                setSortType(value as string)
                break;
            default:
                break;
        }
    }

    const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(event.target.value)
    }

    return (
        <>
            <CommunityLeftButtonContainer>
                <FormControl size={'small'} fullWidth>
                    <InputLabel id="demo-simple-select-label">분류</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={classification}
                        label="classification"
                        name="classification"
                        onChange={selectChangeHandler}
                    >
                        {
                            classificationLabels.map((label: string) => (
                                <MenuItem value={label} key={label}>{label}</MenuItem>
                            ))
                        }
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
                        {
                            sortTypesLabels.map((label: string) => (
                                <MenuItem value={label} key={label}>{label}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </CommunityLeftButtonContainer>
            <CommunityRightButtonContainer>
                <CommunityRightOnlyButtonContainer>

                    <Link to={"/addCommunityPost"}>
                        <Button variant="contained" endIcon={<CreateIcon/>}>
                            글쓰기
                        </Button>
                    </Link>
                    <Button variant="contained" endIcon={<SearchIcon/>}
                            onClick={() => {
                                setShowSearchBar(!showSearchBar)
                            }}
                    >
                        검색
                    </Button>
                </CommunityRightOnlyButtonContainer>
                {showSearchBar && <CommunitySearchWordContainer>
                    <TextField onChange={searchChangeHandler} id="standard-basic" label="검색기능 준비중입니다"
                               variant="standard"/>
                </CommunitySearchWordContainer>}
            </CommunityRightButtonContainer>

        </>

    );
}

export default CommunityPageButtons;