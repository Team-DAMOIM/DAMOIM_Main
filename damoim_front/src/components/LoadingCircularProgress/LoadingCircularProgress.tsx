import React from 'react';
import {LoadingArea} from "./LoadingCircularProgressStyles";
import {CircularProgress} from "@mui/material";

const LoadingCircularProgress = () => {
  return (
    <LoadingArea>
      <CircularProgress/>
    </LoadingArea>
  );
};

export default LoadingCircularProgress;