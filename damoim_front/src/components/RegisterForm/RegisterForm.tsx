import React, { Dispatch, SetStateAction, useState} from 'react';
import {
    LoginRightContentContainer, LoginTextFieldContainer,
    LoginTitleContainer, RegisterGuideContainer
} from "../LoginForm/loginFormStyles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";


import {useFormik} from 'formik';
import * as yup from 'yup';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../../firebase-config";
import {doc, setDoc, Timestamp} from "firebase/firestore";
import TopCenterSnackBar from "../TopCenterSnackBar/TopCenterSnackBar";

interface RegisterFormTypes {
    setCurrentForm: Dispatch<SetStateAction<string>>;
    setRegisterSuccess: Dispatch<SetStateAction<boolean>>;
    handleClose: () => void;
}


const validationSchema = yup.object({
    password: yup
        .string()
        .min(8, '비밀번호는 8글자 이상 사용하셔야 합니다 ')
        .required('비밀번호를 입력해주세요'),
    passwordCheck: yup.string()
        .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.'),
    name: yup.string()
        .required('이름을 입력해주세요'),
    nickName: yup.string()
        .min(2, "닉네임은 2글자 이상 사용하셔야 합니다.")
        .required('닉네임을 입력해주세요'),
    email: yup.string()
        .email('이메일 형식을 맞춰주세요')
        .required('이메일을 입력해주세요'),

});

function RegisterForm({setCurrentForm, setRegisterSuccess, handleClose}: RegisterFormTypes) {

    const [existEmail, setExistEmail] = useState<boolean>(false)


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            passwordCheck: '',
            name: '',
            nickName: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const result = await createUserWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                );
                await setDoc(doc(db, "users", result.user.uid), {
                    uid: result.user.uid,
                    email: values.email,
                    name: values.name,
                    nickName: values.nickName,
                    isOnline: true,
                    createdAt: Timestamp.fromDate(new Date())
                })
                handleClose();
                setRegisterSuccess(true);
            } catch (err) {
                setExistEmail(true);
            }
        },
    });
    return (
        <>
            <LoginRightContentContainer>
                <LoginTitleContainer>
                    <h2>DAMOIM 회원가입</h2>
                    <span>회원가입을 통해 다모임을 자유롭게 이용할 수 있습니다</span>
                </LoginTitleContainer>
                <LoginTextFieldContainer>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            label="이메일"
                            id="outlined-size-small"
                            placeholder={"이메일을 입력해주세요"}
                            size="small"
                            fullWidth
                            margin={"dense"}

                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            label="비밀번호"
                            id="outlined-size-small"
                            placeholder={"비밀번호를 입력해주세요"}
                            size="small"
                            fullWidth
                            margin={"dense"}
                            name="password"
                            type={"password"}

                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <TextField
                            label="비밀번호 확인"
                            id="outlined-size-small"
                            placeholder={"비밀번호를 입력해주세요"}
                            size="small"
                            fullWidth
                            margin={"dense"}
                            name="passwordCheck"
                            type={"password"}

                            value={formik.values.passwordCheck}
                            onChange={formik.handleChange}
                            error={formik.touched.passwordCheck && Boolean(formik.errors.passwordCheck)}
                            helperText={formik.touched.passwordCheck && formik.errors.passwordCheck}
                        />
                        <TextField
                            label="이름"
                            id="outlined-size-small"
                            placeholder={"이름을 입력해주세요"}
                            size="small"
                            fullWidth
                            margin={"dense"}
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}

                        />
                        <TextField
                            label="닉네임"
                            id="outlined-size-small"
                            placeholder={"닉네임을 입력해주세요"}
                            size="small"
                            fullWidth
                            margin={"dense"}
                            name="nickName"
                            value={formik.values.nickName}
                            onChange={formik.handleChange}
                            error={formik.touched.nickName && Boolean(formik.errors.nickName)}
                            helperText={formik.touched.nickName && formik.errors.nickName}
                        />


                        <Button type="submit" fullWidth variant="outlined" startIcon={<LoginIcon/>}>
                            회원가입
                        </Button>
                    </form>
                </LoginTextFieldContainer>


                <RegisterGuideContainer>
                    <span>계정이 있으신가요?..</span> <span style={{color: '#1976d2', cursor: 'pointer'}}
                                                    onClick={() => {
                                                        setCurrentForm("login")
                                                    }}>로그인하기</span>
                </RegisterGuideContainer>
            </LoginRightContentContainer>
            <TopCenterSnackBar value={existEmail} setValue={setExistEmail} severity={"error"} content={"존재하는 이메일입니다. 다른 이메일을 사용해주세요"}/>

        </>
    );
}

export default RegisterForm;