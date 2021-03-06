import React, {ChangeEvent, Dispatch, SetStateAction, useState} from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
    LoginRightContentContainer,
    LoginTextFieldContainer,
    LoginTitleContainer, RegisterGuideContainer, SocialLoginContainer, SocialLoginIconContainer
} from "./loginFormStyles";
import {FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import LoginIcon from '@mui/icons-material/Login';
import {signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {auth, db} from "../../firebase-config";
import {doc, getDocs, query, setDoc, Timestamp, updateDoc, where} from "firebase/firestore";
import TopCenterSnackBar from "../TopCenterSnackBar/TopCenterSnackBar";
import {usersCollectionRef} from "../../firestoreRef/ref";
import {userInfoTypes} from "../../utils/types";

interface LoginFormTypes {
    setCurrentForm: Dispatch<SetStateAction<string>>;
    setLoginSuccess: Dispatch<SetStateAction<boolean>>;
    handleClose: () => void;
}

interface State {
    email: string;
    password: string;
    showPassword: boolean;
    error: null | string;
    loading: boolean;

}

function LoginForm({setCurrentForm, handleClose, setLoginSuccess}: LoginFormTypes) {
    const [userNotFound, setUserNotFound] = useState<boolean>(false)
    const [values, setValues] = useState<State>({
        email: '',
        password: '',
        showPassword: false,
        error: null,
        loading: false,

    });


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
            setValues({...values, error: "????????? ??????????????? ????????? ??????????????????"});
        }
        try {
            const result = await signInWithEmailAndPassword(auth, values.email, values.password);

            await updateDoc(doc(db, "users", result.user.uid), {
                isOnline: true,
            });

            handleClose();
            setLoginSuccess(true);
        } catch (err: any) {
            setValues({...values, error: err.message, loading: false});
            setUserNotFound(true)

        }
    };

    const provider = new GoogleAuthProvider();
    const googleLogin = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;

                const userQuery = await query(usersCollectionRef, where("uid", "==", user.uid))
                const userData = await getDocs(userQuery);
                // ???????????? ?????? ??????
                if (userData.docs.map(doc => ({...doc.data()}))[0] === undefined) {
                    await setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName,
                        nickName: user.displayName,
                        isOnline: true,
                        createdAt: Timestamp.fromDate(new Date()),
                        avatar: user.photoURL,
                        temperature:"36"
                    })
                }
                handleClose();
                setLoginSuccess(true);
                // ...
            }).catch((error) => {
            console.log(error)
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }


    return (

        <LoginRightContentContainer>
            <LoginTitleContainer>
                <h2>DAMOIM ?????????</h2>
                <span>OTT ????????? ?????????</span>
            </LoginTitleContainer>
            <LoginTextFieldContainer>
                <TextField
                    label="?????????"
                    id="outlined-size-small"
                    placeholder={"????????? ???????????????"}
                    size="small"
                    fullWidth
                    margin={"dense"}
                    onChange={handleChange('email')}
                />
                <FormControl variant="outlined" fullWidth size={"small"} margin={"dense"}
                >
                    <InputLabel htmlFor="outlined-adornment-password">????????????</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange('password')}
                        placeholder={"??????????????? ???????????????"}
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
                <div onClick={() => {
                    setCurrentForm("resetPassword")
                }} className={"forget-password"}>??????????????? ????????????????
                </div>

                <Button onClick={onSubmitLogin} fullWidth variant="outlined" startIcon={<LoginIcon/>}>
                    {values.loading ? "????????? ????????????" : "?????????"}
                </Button>
            </LoginTextFieldContainer>

            <SocialLoginContainer>
                <h3>?????? ???????????? ?????????</h3>
                <SocialLoginIconContainer>
                    <img src={'/images/socialLoginIcon/naver.png'} alt={"naver"}/>
                    <img src={'/images/socialLoginIcon/kakaotalk.png'} alt={"kakaotalk"}/>
                    <img src={'/images/socialLoginIcon/facebook.png'} alt={"facebook"}/>
                    <img src={'/images/socialLoginIcon/google.png'} alt={"google"} onClick={googleLogin}/>
                </SocialLoginIconContainer>
            </SocialLoginContainer>
            <RegisterGuideContainer>
                <span>????????? ????????????????..</span> <span style={{color: '#1976d2', cursor: 'pointer'}} onClick={() => {
                setCurrentForm("register")
            }}>??????????????????</span>
            </RegisterGuideContainer>
            <TopCenterSnackBar value={userNotFound} setValue={setUserNotFound} severity={"error"}
                               content={"???????????? ????????? ?????? ??? ????????????. ?????? ??? ?????? ??????????????????."}/>
        </LoginRightContentContainer>
    );
}

export default LoginForm;