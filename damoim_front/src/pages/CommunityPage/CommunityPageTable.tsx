import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableFooter, TablePagination} from "@mui/material";
import {getDocs, DocumentData, query, where, orderBy, Query} from "firebase/firestore";
import { useEffect, useState} from "react";
import {Link} from 'react-router-dom'
import {communityCollectionRef} from "../../firestoreRef/ref";
import TablePaginationActions from "../../components/TablePaginationActions/TablePaginationActions";
import {StyledTableCell, StyledTableRow} from "./communityPageStyles";
import {getSortTypeEN} from "../../utils/functions/indes";




interface CommunityPageTableProps {
    classification: string;
    sortType: string;
    searchWord: string;
}

function CommunityPageTable({classification, sortType, searchWord}: CommunityPageTableProps) {

    const [communityPosts, setCommunityPosts] = useState<DocumentData[]>([])
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    useEffect(() => {
        const getCommunityPosts = async () => {
            let sortTypeEN = getSortTypeEN(sortType);

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
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            labelRowsPerPage={"페이지별 게시물 개수"}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

export default CommunityPageTable;


