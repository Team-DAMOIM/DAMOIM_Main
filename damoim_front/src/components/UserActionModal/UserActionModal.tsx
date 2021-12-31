import React, {Dispatch, SetStateAction, useState} from 'react';
import {
    BootstrapDialog,
    DialogContentContainer,
    LoginFormContainer,
    LoginImageContainer,
} from "../LoginForm/loginFormStyles";
import DialogContent from "@mui/material/DialogContent";
import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import ResetPasswordForm from "../ResetPasswordForm/ResetPasswordForm";


interface UserActionModalTypes {
    userActionModalOpen: boolean;
    setUserActionModalOpen: Dispatch<SetStateAction<boolean>>;
    setLoginSuccess: Dispatch<SetStateAction<boolean>>;
    setRegisterSuccess: Dispatch<SetStateAction<boolean>>;
    setResetPasswordSuccess : Dispatch<SetStateAction<boolean>>;
}

function UserActionModal({
                             userActionModalOpen,
                             setUserActionModalOpen,
                             setLoginSuccess,
                             setRegisterSuccess,
                             setResetPasswordSuccess
                         }: UserActionModalTypes) {

    const [currentForm, setCurrentForm] = useState<string>("login")

    const handleClose = () => {
        setUserActionModalOpen(false);
    }

    return (
        <LoginFormContainer>
            <BootstrapDialog open={userActionModalOpen} onClose={handleClose} fullWidth maxWidth={"md"}>
                <DialogContent>
                    <DialogContentContainer>
                        <LoginImageContainer>
                            <img src="/images/loginBanner.png" alt={"adad"}/>
                        </LoginImageContainer>
                        {
                            currentForm === "login" ?
                                <LoginForm setLoginSuccess={setLoginSuccess} handleClose={handleClose}
                                           setCurrentForm={setCurrentForm}/> :
                                currentForm === "register" ?
                                    <RegisterForm setRegisterSuccess={setRegisterSuccess} handleClose={handleClose}
                                                  setCurrentForm={setCurrentForm}/>
                                    : <ResetPasswordForm setResetPasswordSuccess={setResetPasswordSuccess} handleClose={handleClose}
                                                    setCurrentForm={setCurrentForm}/>

                        }
                    </DialogContentContainer>
                </DialogContent>

            </BootstrapDialog>

        </LoginFormContainer>);
}

export default UserActionModal;
