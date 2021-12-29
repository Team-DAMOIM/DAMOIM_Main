import {styled as muiStyled} from '@mui/material/styles';
import styled from "styled-components";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export const CommunityPageContainer = styled.div`
  width: 100%;
`;

export const CommunityButtonContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 30px;
`

export const CommunityLeftButtonContainer = styled.div`
  width: 40%;
  text-align: start;
  margin-left: 4vw;
  display: flex;

  div:first-child {
    margin-right: 10px;
  }


  @media screen and (max-width: 1096px) {
    width: 60%;
  }

  @media screen and (max-width: 730px) {
    width: 80%;
  }

  @media screen and (max-width: 480px) {
    flex-direction: column;
    div:first-child {
      margin-bottom: 10px;
    }
  }

`
export const CommunityRightButtonContainer = styled.div`
  margin-right: 4vw;

  button:first-child {
    margin-right: 10px;
  }

  display: flex;
  flex-direction: column;
  align-items: end;
`

export const CommunityRightOnlyButtonContainer = styled.div`
  display: flex;
  a{
    text-decoration: none;
  }
  @media screen and (max-width: 480px) {
    flex-direction: column;
    button:first-child {
      margin-bottom: 25px;
    }
    button{
      font-size: 1.10rem;
    }
  }
`


export const CommunitySearchWordContainer = styled.div`
  margin-top: 10px;
  text-align: end;
`

export const CommunityTableContainer = styled.div`
  margin: 4vw;
  a{
    text-decoration: none;
    color: #444;
    transition: all 0.5s ease-in-out;
    font-weight: bold;

    &:hover{
      color: black;
    }
  }
`
export const StyledTableCell = muiStyled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontWeight: 'bold',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export const StyledTableRow = muiStyled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

