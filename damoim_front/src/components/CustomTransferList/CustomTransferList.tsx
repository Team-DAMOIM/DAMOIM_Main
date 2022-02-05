import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import {  doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

interface CustomTransferListTypes {
  leftValue: string[];
  setLeftValue: Dispatch<SetStateAction<string[]>>;
  rightValue: string[];
  setRightValue: Dispatch<SetStateAction<string[]>>;
}

const CustomTransferList = ({ leftValue, setLeftValue, rightValue, setRightValue }: CustomTransferListTypes) => {

  //**************************************************************//

  // UID
  const [checkedUID, setCheckedUID] = useState<string[]>([]);
  const [leftUID, setLeftUID] = useState<string[]>(leftValue);
  const [rightUID, setRightUID] = useState<string[]>(rightValue);

  const leftUIDChecked = intersection(checkedUID, leftUID);
  const rightUIDChecked = intersection(checkedUID, rightUID);


  const [width,setWidth] = useState(window.innerWidth) ;
  const handleResize = () => {
    setWidth(window.innerWidth)
  }


  useEffect(()=>{
    window.addEventListener('resize',handleResize);
    return () => {
      window.removeEventListener('resize',handleResize)
    }
  })


  // leftUID의 uid들을 가지고 user name으로 바꿔줌
  useEffect(() => {
    const getUserName = async () => {
      for (let i = leftValue.length - 1; i >= 0; i--) {
        let uid = leftValue[i];
        let docRef = doc(db, "users", uid);
        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          let userName = docSnap.data().nickName;
          setLeft(left => [...left, userName]);
        } else {
          setLeft(left => [...left, uid]);
        }
      }
    }
    getUserName();
  }, []);
  

  // user name
  const [checked, setChecked] = useState<readonly string[]>([]);
  const [left, setLeft] = useState<readonly string[]>([]);
  const [right, setRight] = useState<readonly string[]>([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  //**************************************************************//

  const handleToggle = (value: string, valueUID: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    const currentIndexUID = checkedUID.indexOf(valueUID);
    const newCheckedUID = [...checkedUID];

    if (currentIndex === -1) {
      newChecked.push(value);
      newCheckedUID.push(valueUID);
    } else {
      newChecked.splice(currentIndex, 1);
      newChecked.splice(currentIndexUID, 1);
    }

    setChecked(newChecked);
    setCheckedUID(newCheckedUID);
  };

  const handleCheckedRight = () => {
    if ( (right.length + checked.length) > 3 ) {
      alert("파티원은 최대 3명까지 등록할 수 있습니다. (파티 정원: 파티장 포함 4명)")
    } else {
      setRight(right.concat(leftChecked));
      setRightUID(rightUID.concat(leftUIDChecked));
      
      setLeft(not(left, leftChecked));
      setLeftUID(not(leftUID, leftUIDChecked));

      setChecked(not(checked, leftChecked));
      setCheckedUID(not(checkedUID, leftUIDChecked));

      setRightValue(rightUID.concat(leftUIDChecked));  // 상위 컴포넌트의 useState의 setValue 함수 (함께할 파티원 배열을 변경함)
    }
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setLeftUID(leftUID.concat(rightUIDChecked));

    setRight(not(right, rightChecked));
    setRightUID(not(rightUID, rightUIDChecked));

    setChecked(not(checked, rightChecked));
    setCheckedUID(not(checkedUID, rightUIDChecked));

    setRightValue(not(rightUID, rightUIDChecked)); // // 상위 컴포넌트의 useState의 setValue 함수 (함께할 파티원 배열을 변경함)
  };

  const customList = (items: readonly string[], itemsUID: string[]) => (
    <Paper sx={{ width: width > 600 ? 240 : width-100, height: width > 600 ? 230 : 150, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value: string, idx) => {
          return (
            <ListItem
              key={items[idx]}
              role="listitem"
              button
              onClick={handleToggle(items[idx], itemsUID[idx])}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(items[idx]) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={items[idx]} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList(left, leftUID)}</Grid>
      <Grid item>
        <Grid container  direction={width > 600 ? "column" : "row"} alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
             {width > 600 ? '▶' : '🔽' }
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            {width > 600 ? '◀' : '🔼' }          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right, rightUID)}</Grid>
    </Grid>
  );
}

export default CustomTransferList;