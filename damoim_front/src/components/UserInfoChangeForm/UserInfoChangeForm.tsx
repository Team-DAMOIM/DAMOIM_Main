import React, {ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import {
    Backdrop,
    CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputBase
} from "@mui/material";
import {useFormik} from 'formik';
import * as yup from 'yup';
import {LoginTextFieldContainer, LoginTitleContainer} from "../LoginForm/loginFormStyles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import {auth, db, storage} from "../../firebase-config";
import {doc, Timestamp, updateDoc} from "firebase/firestore";
import {AuthContext} from "../../context/AuthContext";
import DriveFolderUploadTwoToneIcon from '@mui/icons-material/DriveFolderUploadTwoTone';
import {
    ref,
    getDownloadURL,
    uploadBytes,
    deleteObject,
} from "firebase/storage";
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import {UserInfoChangeFileInputContainer, UserInfoChangeFileSVGContainer} from "./userInfoChangeFormStyles";
import {userInfoTypes} from "../../utils/types";
import {updateEmail} from "firebase/auth";
import TopCenterSnackBar from "../TopCenterSnackBar/TopCenterSnackBar";

interface UserInfoChangeFormTypes {
    userInfoChangeOpen: boolean;
    setUserInfoChangeOpen: Dispatch<SetStateAction<boolean>>;
    userInfo: userInfoTypes
    setUserInfo: Dispatch<SetStateAction<userInfoTypes>>;
    setUserInfoChangeSuccess : Dispatch<SetStateAction<boolean>>;
}

const validationSchema = yup.object({
    name: yup.string()
        .required('이름을 입력해주세요'),
    nickName: yup.string()
        .min(2, "닉네임은 2글자 이상 사용하셔야 합니다.")
        .required('닉네임을 입력해주세요'),
    email: yup.string()
        .email('이메일 형식을 맞춰주세요')
        .required('이메일을 입력해주세요'),

});

function UserInfoChangeForm({
                                userInfoChangeOpen,
                                setUserInfoChangeOpen,
                                setUserInfo,
                                userInfo,
                                setUserInfoChangeSuccess
                            }: UserInfoChangeFormTypes) {

    const [img, setImg] = useState<File>();
    const [loading, setLoading] = useState<boolean>(false)
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false)
    const [openDeleteConfirm,setOpenDeleteConfirm] = useState<boolean>(false)

    const handleClose = () => {
        setUserInfoChangeOpen(false);
    }

    const handleDeleteCOnfirmClose = () => {
        setOpenDeleteConfirm(false)
    }
    const user = useContext(AuthContext)

    useEffect(() => {
        if (img) {
            const uploadImg = async () => {
                setLoading(true);
                const imgRef = ref(
                    storage,
                    `avatar/${new Date().getTime()} - ${img.name}`
                );
                try {
                    if (userInfo.avatarPath) {
                        await deleteObject(ref(storage, userInfo.avatarPath));
                    }
                    const snap = await uploadBytes(imgRef, img);
                    const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
                    await updateDoc(doc(db, "users", user?.uid as string), {
                        avatar: url,
                        avatarPath: snap.ref.fullPath,
                    });

                    setUserInfo({
                        ...userInfo, avatar: url, avatarPath: snap.ref.fullPath
                    })
                    setImg(undefined);
                    setLoading(false);
                    setUploadSuccess(true);
                } catch (err: any) {
                    console.log(err.message);
                }
            };
            uploadImg();
        }
    }, [img])

    const formik = useFormik({
        initialValues: {
            email: userInfo.email,
            name: userInfo.name,
            nickName: userInfo.nickName,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (auth.currentUser) {
                    setLoading(true);
                    await updateEmail(auth.currentUser, values.email);
                    await updateDoc(doc(db, "users", user?.uid as string), {
                        uid: user?.uid,
                        email: values.email,
                        name: values.name,
                        nickName: values.nickName,
                    })
                    setUserInfo({
                        ...userInfo, email: values.email,
                        name: values.name,
                        nickName: values.nickName,
                    })
                    handleClose();
                    setLoading(false)
                    setUserInfoChangeSuccess(true);
                }
            } catch (err) {
                console.log(err)
            }
        },
    });

    const deleteImage = async () => {
        try {
                setLoading(true);
                await deleteObject(ref(storage, userInfo.avatarPath));

                await updateDoc(doc(db, "users", user?.uid as string), {
                    avatar: "",
                    avatarPath: "",
                });
                setUserInfo({
                    ...userInfo, avatar: "",
                    avatarPath: "",
                })
                setLoading(false);
                setDeleteSuccess(true);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    return (
        <>
            <Dialog open={userInfoChangeOpen} onClose={handleClose} fullWidth maxWidth={"md"}>
                <DialogContent>
                    <LoginTitleContainer>
                        <h2>DAMOIM 정보수정</h2>
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
                            <UserInfoChangeFileInputContainer>
                                <img src={userInfo?.avatar || '/images/personIcon.png'} alt={"avatar"}/>
                                <UserInfoChangeFileSVGContainer>
                                    <label htmlFor="photo">
                                        <DriveFolderUploadTwoToneIcon/>
                                    </label>
                                    {userInfo.avatar ? <DeleteForeverTwoToneIcon onClick={()=>{
                                        setOpenDeleteConfirm(true);
                                    }}/> : null}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{display: 'none'}}
                                        id="photo"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (e && e.target && e.target.files)
                                                setImg(e.target.files[0])
                                        }}
                                    />
                                </UserInfoChangeFileSVGContainer>
                            </UserInfoChangeFileInputContainer>

                            <Button type="submit" fullWidth variant="outlined" startIcon={<LoginIcon/>}>
                                정보 수정
                            </Button>
                        </form>
                    </LoginTextFieldContainer>
                </DialogContent>
                {
                    <Backdrop
                        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                        open={loading}
                    >
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                }

                <TopCenterSnackBar value={uploadSuccess} setValue={setUploadSuccess} severity={"success"}
                                   content={"프로필 사진 업데이트 성공 ! "}/>
                <TopCenterSnackBar value={deleteSuccess} setValue={setDeleteSuccess} severity={"success"}
                                   content={"프로필 사진 삭제 성공 ! "}/>
            </Dialog>

            <Dialog
                open={openDeleteConfirm}
                onClose={handleDeleteCOnfirmClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"프로필 사진 삭제"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        정말로 프로필 사진을 삭제하시겠습니까? 유실된 데이터는 복구 불가능 합니다.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCOnfirmClose}>취소</Button>
                    <Button onClick={()=>{
                        deleteImage();
                        handleDeleteCOnfirmClose()
                    }} autoFocus>
                        삭제
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default UserInfoChangeForm;