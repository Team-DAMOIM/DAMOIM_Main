import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {Dispatch, SetStateAction, useState} from "react";

interface MobileNavbarTypes {
  setUserActionModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function MobileNavbar({setUserActionModalOpen}: MobileNavbarTypes) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(true);
  }

  const list = () => (
    <Box
      sx={{width: 'auto'}}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}
            </ListItemIcon>
            <ListItemText primary={text}/>
          </ListItem>
        ))}
      </List>
      <Divider/>
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}
            </ListItemIcon>
            <ListItemText primary={text}/>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer}>sdada</Button>
      <Drawer
        anchor={'top'}
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        {list()}
      </Drawer>
    </div>
  );
}
