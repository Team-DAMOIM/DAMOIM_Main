import * as React from 'react';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useTheme} from '@mui/material/styles';
import {Box, TableFooter, TablePagination} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {collection,getDocs,DocumentData} from "firebase/firestore";
import {db} from "../../firebase-config";
import {useEffect, useState} from "react";
interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const {count, page, rowsPerPage, onPageChange} = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{flexShrink: 0, ml: 2.5}}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
            </IconButton>
        </Box>
    );
}


const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontWeight:'bold',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,

    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function createData(
    classfication: string,
    title: string,
    writer: string,
    platform: string,
    love: number,
    date: string,
) {
    return {classfication, title, writer, platform, love, date};
}

const rows = [
    createData('공지', "넷플릭스요즘에이상합니다", "유인칠", "------", 5, "12.27"),
    createData('질문', "왓챠님으드자음ㅇㄴ므암ㅇ", "오준호", "왓챠", 1, "12.24"),
    createData('잡담', "넷플릭스요즘에이상합니다", "유인찔", "넷플릭스", 23, "12.27"),
    createData('추천', "넷플릭스요즘에이상합니다", "우녕진", "디즈니플러스", 9, "12.27"),
    createData('공지', "넷플릭스요즘에이상합니다", "우녕진", "------", 5, "12.27"),
    createData('질문', "왓챠님으드자음ㅇㄴ므암ㅇ", "개복치", "왓챠", 1, "12.24"),
    createData('잡담', "넷플릭sadad스요즘에이상합니다", "우녕진", "넷플릭스", 23, "12.27"),
    createData('추천', "넷플릭스요즘에이상합니다", "우녕진", "디즈니플러스", 9, "12.27"),
    createData('공지', "넷플릭스요즘에이상합니다", "우녕진", "------", 5, "12.27"),
    createData('질문', "왓챠님으드자음ㅇㄴ므암ㅇ", "개복치", "왓챠", 1, "12.24"),
    createData('잡담', "넷플릭스요즘에이상합니다", "우녕진", "넷플릭스", 23, "12.27"),
    createData('추천', "넷플릭스요즘에이상합니다", "우녕진", "디즈니플러스", 9, "12.27"),
];
interface communityPostType {
    writer:string;
    classification : string;
    platform : string;
    views:number;
    loves:number;
    createdAt : any;
    title:string;
    content:string;
}
function CommunityPageTable() {
    const communityCollectionRef = collection(db, "communityPosts");
    const [communityPosts,setCommunityPosts] = useState<DocumentData[]>([])


    useEffect(()=>{
        const getCommunityPosts = async () => {
            const data = await getDocs(communityCollectionRef);
            setCommunityPosts(data.docs.map((doc) => ( doc.data() )));
            const posts = data.docs.map((doc) => (doc.data() ));
            console.log(data.docs.map((doc) => (doc.data() )))
            posts.map(post=>(
                rows.push(createData(post.classification,post.title.substring(0,40),post.writer,post.platform,post.love,"12.17"))
            ))
        }
        getCommunityPosts()
    },[])

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 700}} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>분류</StyledTableCell>
                        <StyledTableCell >제목</StyledTableCell>
                        <StyledTableCell align="right">작성자</StyledTableCell>
                        <StyledTableCell align="right">플랫폼</StyledTableCell>
                        <StyledTableCell align="right">추천수</StyledTableCell>
                        <StyledTableCell align="right">날짜</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                    ).map((row, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                                {row.classfication}
                            </StyledTableCell>
                            <StyledTableCell>{row.title}</StyledTableCell>
                            <StyledTableCell align="right">{row.writer}</StyledTableCell>
                            <StyledTableCell align="right">{row.platform}</StyledTableCell>
                            <StyledTableCell align="right">💜{row.love}</StyledTableCell>
                            <StyledTableCell align="right">{row.date}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{height: 53 * emptyRows}}>
                            <TableCell colSpan={6}/>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
                            colSpan={3}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

export default CommunityPageTable;


