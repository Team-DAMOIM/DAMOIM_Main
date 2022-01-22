import React from "react";
import {CircularProgress} from "@material-ui/core";
import {LoadingArea} from "./loadingStyles";

const Loading = () => {
    return (
      <LoadingArea>
        <CircularProgress />
      </LoadingArea>
    );
};

export default Loading;