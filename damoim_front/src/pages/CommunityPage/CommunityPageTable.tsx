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
import {getDocs, DocumentData, query, where, orderBy, Query} from "firebase/firestore";
import {useEffect, useState} from "react";
import {Link} from 'react-router-dom'
import {communityCollectionRef} from "../../firestoreRef/ref";


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
        fontWeight: 'bold',
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


interface CommunityPageTableProps {
    classification: string;
    sortType: string;
    searchWord: string;
}

function CommunityPageTable(props: CommunityPageTableProps) {
    const {classification, sortType, searchWord} = props;

    const [communityPosts, setCommunityPosts] = useState<DocumentData[]>([])


    useEffect(() => {
        const getCommunityPosts = async () => {
            let sortTypeEN: string = "createdAt";
            switch (sortType) {
                case "최신순":
                    sortTypeEN = "createdAt"
                    break;
                case "조회순":
                    sortTypeEN = "views"
                    break;
                case "추천순":
                    sortTypeEN = "loves"
                    break;
                default :
                    break;
            }
            let communityPostQuery: Query<DocumentData>;
            if (classification === "전체") {
                communityPostQuery = await query(communityCollectionRef, orderBy(sortTypeEN, "desc"))
            } else {
                communityPostQuery = await query(communityCollectionRef, where("classification", "==", classification), orderBy(sortTypeEN, "desc"))
            }
            const data = await getDocs(communityPostQuery);
            setCommunityPosts(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }
        getCommunityPosts()
    }, [classification, sortType])


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - communityPosts.length) : 0;

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
                        <StyledTableCell>제목</StyledTableCell>
                        <StyledTableCell align="right">작성자</StyledTableCell>
                        <StyledTableCell align="right">플랫폼</StyledTableCell>
                        <StyledTableCell align="right">추천수</StyledTableCell>
                        <StyledTableCell align="right">날짜</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                            ? communityPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : communityPosts
                    ).map((row, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                                {row.classification}
                            </StyledTableCell>
                            <StyledTableCell><Link  to={`/communityDetail/${row.id}`}>{row.title}</Link></StyledTableCell>
                            <StyledTableCell align="right">{row.writerName}</StyledTableCell>
                            <StyledTableCell align="right">{row.platform}</StyledTableCell>
                            <StyledTableCell align="right">💜{row.loves}</StyledTableCell>
                            <StyledTableCell
                                align="right">{row.createdAt.toDate().getMonth() + 1 + "." + row.createdAt.toDate().getDate()}</StyledTableCell>
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
                            count={communityPosts.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': '페이지별 게시물 개수',
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


