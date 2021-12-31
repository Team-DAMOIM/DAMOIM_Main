import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CreatePartyPageContainer } from './createPartyPageStyles';

const CreatePartyPage = () => {
  const user = useContext(AuthContext);


  return (
    <CreatePartyPageContainer>

    </CreatePartyPageContainer>
  );
};

export default CreatePartyPage;