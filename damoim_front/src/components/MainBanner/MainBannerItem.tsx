import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import MainBanner from './MainBanner';

interface itemsProps {
  item: string,
  name: string
}

const SliderItem = styled.div`
  width: 100%;
  img{
    max-width: 100%;
    height: auto;
    margin: auto;
  }
`;



function Item() {

  const [width,setWidth] = useState(window.innerWidth) ;
  const [items,setItems] = useState<itemsProps[]>();
  const handleResize = () => {
    setWidth(window.innerWidth)
  }

  useEffect(()=>{
    window.addEventListener('resize',handleResize);
    return () => {
      window.removeEventListener('resize',handleResize)
    }
  })


  useEffect(()=>{
    if(width < 500){
      setItems( [
        {
          item: '/images/mainBanner/mainBanner1-mobile.png',
          name: '이미지01'
        },
        {
          item: '/images/mainBanner/mainBanner2-mobile.png',
          name: '이미지02'
        },
        {
          item: '/images/mainBanner/mainBanner3-mobile.png',
          name: '이미지03'
        },
      ])
    }else{
      setItems( [
        {
          item: '/images/mainBanner/mainBanner1.png',
          name: '이미지01'
        },
        {
          item: '/images/mainBanner/mainBanner2.png',
          name: '이미지02'
        },
        {
          item: '/images/mainBanner/mainBanner3.png',
          name: '이미지03'
        },
      ])
    }

  },[width])

  return (
    <MainBanner>
      {items?.map((item, index) => (
        <SliderItem key={index}>
          <img src={item.item} alt={item.name} />
        </SliderItem>
      ))}
    </MainBanner>
  );
}

export default Item;