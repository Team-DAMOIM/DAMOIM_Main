import React from 'react';
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

const items:itemsProps[] = [
  {
    item: 'http://placehold.it/1200x440',
    name: '이미지01'
  },
  {
    item: 'http://placehold.it/1400x440/ff0000',
    name: '이미지02'
  },
  {
    item: 'http://placehold.it/1400x440/00ffff',
    name: '이미지03'
  },    
]

function Item() {
  return (
    <MainBanner>
      {items.map((item, index) => (
        <SliderItem key={index}>
          <img src={item.item} alt={item.name} />
        </SliderItem>
      ))}
    </MainBanner>
  );
}

export default Item;