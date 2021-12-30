import React, {ChangeEvent, Dispatch, SetStateAction, useState} from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {
    DialogContentContainer,
    LoginImageContainer, LoginRightContentContainer,
    LoginTextFieldContainer,
    LoginTitleContainer, RegisterGuideContainer, SocialLoginContainer, SocialLoginIconContainer
} from "./loginFormStyles";
import {FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import LoginIcon from '@mui/icons-material/Login';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../../firebase-config";
import {doc, updateDoc} from "firebase/firestore";


interface LoginFormTypes {
    loginOpen : boolean;
    setLoginOpen:Dispatch<SetStateAction<boolean>>;
    setRegisterOpen: Dispatch<SetStateAction<boolean>>;
    setLoginSuccess : Dispatch<SetStateAction<boolean>>;
}

interface State {
    email: string;
    password: string;
    showPassword: boolean;
    error: null | string;
    loading: boolean;

}

function LoginForm({loginOpen, setLoginOpen,setRegisterOpen,setLoginSuccess}: LoginFormTypes) {

    const [values, setValues] = useState<State>({
        email: '',
        password: '',
        showPassword: false,
        error: null,
        loading: false,

    });
    const handleClose = () => {
        setLoginOpen(false);
    };

    const handleChange =
        (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
            setValues({...values, [prop]: event.target.value});
        };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onSubmitLogin = async (e: any) => {
        e.preventDefault();
        setValues({...values, error: null, loading: true});
        if (!values.email || !values.password) {
            setValues({...values, error: "아이디 비밀번호를 정확히 입력해주세요"});
        }
        try {
            const result = await signInWithEmailAndPassword(auth, values.email, values.password);

            await updateDoc(doc(db, "users", result.user.uid), {
                isOnline: true,
            });
            // setValues({
            //     email: "",
            //     password: "",
            //     error: "",
            //     loading: false,
            //     showPassword:false
            // });
            handleClose();
            setLoginSuccess(true);
        } catch (err: any) {
            setValues({...values, error: err.message, loading: false});
        }
    };

    return (
        <>
            <Dialog open={loginOpen} onClose={handleClose} fullWidth maxWidth={"md"}>
                <DialogContent>
                    <DialogContentContainer>
                        <LoginImageContainer>
                            <img src="https://joeschmoe.io/api/v1/random" alt={"adad"}/>
                        </LoginImageContainer>
                        <LoginRightContentContainer>
                            <LoginTitleContainer>
                                <h2>DAMOIM 로그인</h2>
                                <span>OTT 모임의 시작점</span>
                            </LoginTitleContainer>
                            <LoginTextFieldContainer>
                                <TextField
                                    label="이메일"
                                    id="outlined-size-small"
                                    placeholder={"이메일 입력하시오"}
                                    size="small"
                                    fullWidth
                                    margin={"dense"}
                                    onChange={handleChange('email')}
                                />
                                <FormControl variant="outlined" fullWidth size={"small"} margin={"dense"}
                                >
                                    <InputLabel htmlFor="outlined-adornment-password">비밀번호</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={values.showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        onChange={handleChange('password')}
                                        placeholder={"비밀번호를 입력하시오"}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                                <div className={"forget-password"}>비밀번호를 잊으셨나요?</div>
                                {values.error ? <p className="error">{values.error}</p> : null}

                                <Button onClick={onSubmitLogin} fullWidth variant="outlined" startIcon={<LoginIcon/>}>
                                    {values.loading ? "로그인 중입니다" : "로그인"}
                                </Button>
                            </LoginTextFieldContainer>

                            <SocialLoginContainer>
                                <h3>다른 방법으로 로그인</h3>
                                <SocialLoginIconContainer>
                                    <img src={'/images/socialLoginIcon/naver.png'} alt={"naver"}/>
                                    <img src={'/images/socialLoginIcon/kakaotalk.png'} alt={"kakaotalk"}/>
                                    <img src={'/images/socialLoginIcon/facebook.png'} alt={"facebook"}/>
                                    <img src={'/images/socialLoginIcon/google.png'} alt={"google"}/>
                                </SocialLoginIconContainer>
                            </SocialLoginContainer>
                            <RegisterGuideContainer>
                                <span>계정이 없으신가요?..</span> <span style={{color: '#1976d2', cursor:'pointer'}} onClick={() => {
                                handleClose();
                                setRegisterOpen(true)
                            }}>회원가입하기</span>
                            </RegisterGuideContainer>
                        </LoginRightContentContainer>
                    </DialogContentContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}><CancelOutlinedIcon color={"action"}/></Button>
                </DialogActions>

            </Dialog>

        </>
    );
}

export default LoginForm;