import {UserPageFriendsContainer, UserPageFriendsSVGContainer} from "./UserPageFriendsStyles";
import {Avatar, Checkbox, List, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import {useState} from "react";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
function UserPageFriends(props: any) {
    const [checked, setChecked] = useState([1]);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
        <UserPageFriendsContainer>
            <List dense sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                {[0, 1, 2, 3].map((value) => {
                    const labelId = `checkbox-list-secondary-label-${value}`;
                    return (
                        <ListItem
                            key={value}
                            secondaryAction={
                                <Checkbox
                                    edge="end"
                                    onChange={handleToggle(value)}
                                    checked={checked.indexOf(value) !== -1}
                                    inputProps={{'aria-labelledby': labelId}}
                                />
                            }
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={`Avatar n°${value + 1}`}
                                        src={`/images/personIcon.png`}
                                    />
                                </ListItemAvatar>
                                <ListItemText id={labelId} primary={`Line item ${value + 1}`}/>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <UserPageFriendsSVGContainer>
                <AddCircleTwoToneIcon/>
                <DeleteTwoToneIcon/>
            </UserPageFriendsSVGContainer>

        </UserPageFriendsContainer>
    );

}

export default UserPageFriends;