import React, {ChangeEvent, Dispatch, SetStateAction, useState} from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
    LoginRightContentContainer, LoginTextFieldContainer,
    LoginTitleContainer, RegisterGuideContainer
} from "../LoginForm/loginFormStyles";
import EmailIcon from '@mui/icons-material/Email';
import {getAuth,sendPasswordResetEmail} from "firebase/auth";
import TopCenterSnackBar from "../TopCenterSnackBar";

interface ResetPasswordFormTypes {
    setCurrentForm: Dispatch<SetStateAction<string>>;
    setResetPasswordSuccess: Dispatch<SetStateAction<boolean>>;
    handleClose: () => void;
}


function ResetPasswordForm({setCurrentForm,  setResetPasswordSuccess}: ResetPasswordFormTypes) {

    const [email, setEmail] = useState<string>('')
    const [userNotFound,setUserNotFound] = useState<boolean>(false)

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }


    const onSubmit = async (e: any) => {
        e.preventDefault();

        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setResetPasswordSuccess(true)
                setCurrentForm("login")
            })
            .catch((error) => {
                alert(error)
                setUserNotFound(true)
            });
    };

    return (

        <LoginRightContentContainer>
            <LoginTitleContainer>
                <h2>DAMOIM 비밀번호 찾기</h2>
                <span>이메일로 비밀번호 초기화 링크를 보내드립니다
비밀번호 초기화 링크를 클릭하여 비밀번호를 변경하실 수 있습니다</span>
            </LoginTitleContainer>
            <LoginTextFieldContainer>
                <TextField
                    label="이메일"
                    id="outlined-size-small"
                    placeholder={"이메일 입력하시오"}
                    size="small"
                    fullWidth
                    margin={"dense"}
                    onChange={changeHandler}
                />
                <Button onClick={onSubmit} fullWidth variant="outlined" startIcon={<EmailIcon/>}>
                   이메일 발송
                </Button>
            </LoginTextFieldContainer>


            <RegisterGuideContainer>
                <span>계정이 기억나셨나요?..</span> <span style={{color: '#1976d2', cursor: 'pointer'}} onClick={() => {
                setCurrentForm("login")
            }}>로그인하기</span>
            </RegisterGuideContainer>
            <TopCenterSnackBar value={userNotFound} setValue={setUserNotFound} severity={"error"} content={"존재하는 회원을 찾을 수 없습니다. 확인 후 다시 입력해주세요."}/>
        </LoginRightContentContainer>
    );
}

export default ResetPasswordForm;