'use client';
import * as React from 'react';
import { styled,Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LoginIcon from '@mui/icons-material/Login';
import LoginModal from './LoginModal';

import { useSession, signIn, signOut } from "next-auth/react"
import Login from '@mui/icons-material/Login';

const drawerWidth = 360;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 3),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'normal',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const UnLoggedIcon = ({ setOpen }:{ setOpen:React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className='p-3 flex items-center space-x-5'>
    <IconButton
      onClick={() => {
        setOpen(true)
      }}
    >
      <LoginIcon />
    </IconButton>
    <div>未登录</div>
  </div>
  )
}

const LoggedIcon = () => {

  const { data: session, status } = useSession()
  const userEmail = session?.user?.email

  return (
    <div className='p-3 flex items-center space-x-5'>
      <IconButton
        onClick={() => {
          signOut()
        }}
      >
        <LockOpenIcon />
      </IconButton>
      <div>
        {userEmail}
      </div>
    </div>
  )
}

export default function SideBar() {
  const [open, setOpen] = React.useState(false);

  const [loginModalOpen, setLoginModalOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  }

  const { data: session, status } = useSession()

  return (
    <Drawer variant="permanent" open={open} className='hidden lg:block'>
        <DrawerHeader>
          <div className='flex items-center space-x-3' style={{
            opacity: open ? 1 : 0,
          }}>
            <div className='font-bold'>Chiral-Phonon-Material-Database</div>
          </div>
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        {
          status === 'authenticated' ? <LoggedIcon /> : <UnLoggedIcon setOpen={setLoginModalOpen}/>
        }
        <Divider />
        <List>
          {['Search','Info'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {
                    text === 'Search' ? <SearchIcon /> : <InfoIcon />
                  }
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} />
      </Drawer>
  );
}
