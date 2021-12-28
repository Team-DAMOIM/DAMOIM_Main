import React from 'react';
import { SlideWrapper, StyledSlider } from './mainBannerStyles';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface sliderProps {
  /** 슬라이더 아이템 요소 */
  children: React.ReactNode;
  /** 커스텀 클래스 */
  // className?: string;
}

const MainBanner = ({children}: sliderProps) => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 7000,
    loop: true,
    speed: 2000,
    slidesToShow: 1
  };

  return (
    <SlideWrapper>
      <StyledSlider {...settings}>
        {children}
      </StyledSlider>
    </SlideWrapper>
  );
}

export default MainBanner;