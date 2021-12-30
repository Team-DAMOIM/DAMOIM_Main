import React, {Dispatch, SetStateAction} from 'react';
import {AlertColor, Snackbar} from "@mui/material";
import Alert from "@mui/material/Alert";


interface TopCenterSnackBarTypes {
    value:boolean;
    setValue: Dispatch<SetStateAction<boolean>>;
    severity : AlertColor ;
    content : string;

}

function TopCenterSnackBar({value,setValue,severity,content}:TopCenterSnackBarTypes) {
    return (
        <Snackbar open={value} autoHideDuration={2000}
                  anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                  onClose={() => {
                      setValue(false);
                  }}>
            <Alert severity={severity} sx={{width: '100%'}}>
                {content}
            </Alert>
        </Snackbar>
    );
}

export default TopCenterSnackBar;