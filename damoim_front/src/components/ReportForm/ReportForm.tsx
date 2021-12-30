import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {addDoc} from "firebase/firestore";
import {communityReportCollectionRef} from "../../firestoreRef/ref";
import Alert from "@mui/material/Alert";
import {Snackbar} from "@mui/material";
import TopCenterSnackBar from "../TopCenterSnackBar";

interface ReportFormTypes {
    reportOpen: boolean;
    setReportOpen: Dispatch<SetStateAction<boolean>>;
    postId: string
}


export default function ReportForm({reportOpen, setReportOpen, postId}: ReportFormTypes) {
    const [reportContent, setReportContent] = useState<string>("")
    const [success, setSuccess] = useState<boolean>(false)
    const user = useContext(AuthContext);


    const handleClose = () => {
        setReportOpen(false);
    };

    const onSubmitReport = async (event: FormEvent) => {

        event.preventDefault();
        const variables = {
            postId: postId,
            userUID: user?.uid,
            content: reportContent
        }

        const data = await addDoc(communityReportCollectionRef, variables)
        if (data.id) {
            setSuccess(true);
            setReportOpen(false);
        }


    }
    const textFieldChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setReportContent(event.target.value)
    }

    return (
        <div>
            <TopCenterSnackBar value={success} setValue={setSuccess} severity={"success"} content={"신고가 접수되었습니다 확인 후 조치하겠습니다"}/>
            <Dialog open={reportOpen} onClose={handleClose}>
                <DialogTitle>게시글 신고</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <span style={{color:'black', fontWeight:'bold'}}>신고를 한 상세사유를 기재해주세요</span><br/><br/>
                        게시글 사용자가 신고되면 DAMOIM 담당자가 연중무휴로 검토하여 커뮤니티 가이드의 위반 여부를 판단합니다. 커뮤니티 가이드를 위반한 계정은 불이익을 받게 되며 반복적이거나 심각한 위반이 발생한 경우에는 계정이 해지될 수 있습니다.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="신고 사유"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={textFieldChangeHandler}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={onSubmitReport}>신고하기</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}