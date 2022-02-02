import React from 'react';
import {ScrollToTopButtonContainer} from "./scrollToTopButtonStyles";
import useScrollButton from "../../hooks/useScrollButton";




function ScrollToTopButton() {

  const [BtnStatus,handleTop] = useScrollButton();
  return (
    <ScrollToTopButtonContainer BtnStatus={BtnStatus} onClick={handleTop}>
      TOP
    </ScrollToTopButtonContainer>
  );
}

export default ScrollToTopButton;
