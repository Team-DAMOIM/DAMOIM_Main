import React from 'react';
import {ModifyCommunityPostPageContainer} from "./ModifyCommunityPostPageStyles";
import EditCommunityPost from "../../components/EditCommunityPost/EditCommunityPost";

function ModifyCommunityPostPage() {
  return (
    <ModifyCommunityPostPageContainer>
      <EditCommunityPost edit={true} />
    </ModifyCommunityPostPageContainer>
  );
}

export default ModifyCommunityPostPage;