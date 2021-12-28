import styled from "styled-components";
import Slider from 'react-slick';

export const SlideWrapper = styled.section`
  max-width: 1400px;
  width: 100%;
  margin: 50px auto 0;
  display: block;
  text-align: center;
`;

export const StyledSlider = styled(Slider)`
  .slick-arrow {
    top: 50%;
    transform: translate(0, -50%);
    position: absolute;
    display: block;
    width: 90px;
    height: 90px;
    background: url(//movie-img.yes24.com/NYes24/new/all_sprite.png) no-repeat 0 0;
    z-index: 3;
    cursor: pointer;
  }

  .slick-prev {
    left: 0;
    border: none;
    :before {
      display: none;
      color: black;
    }
  }

  .slick-next {
    right: 0;
    background-position: -120px 0;
    border: none;
    :before {
      display: none;
      color: black;
    }
  }
`
// 위에 :before안에 display: none; 지우면 기본형 작은 arrows black칼러로 나옴.