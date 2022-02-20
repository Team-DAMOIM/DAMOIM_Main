import React from 'react';
import {AddCommunityPostPageContainer} from "./addCommunityPostPageStyles";
import EditCommunityPost from "../../components/EditCommunityPost/EditCommunityPost";


function AddCommunityPostPage() {
  return (
    <AddCommunityPostPageContainer>
        <EditCommunityPost edit={false}/>
    </AddCommunityPostPageContainer>
  );
}

export default AddCommunityPostPage;