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
import UploadIcon from '@mui/icons-material/Upload';

import { WorkOS } from '@workos-inc/node';
import { GET } from '@/request';

import { useRouter } from 'next/navigation';

import { redirectUri } from '@/conf/auth';

const workos = new WorkOS(process.env.NEXT_PUBLIC_WORKOS_API_KEY);
const clientId = process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID as string;

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

const UnLoggedIcon = () => {

  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: 'authkit',
    redirectUri: redirectUri,
    clientId,
  });

  return (
    <div className='p-3 flex items-center space-x-5'>
    <a href={authorizationUrl}>
      <IconButton>
        <LoginIcon />
      </IconButton>
    </a>
    <div>未登录</div>
  </div>
  )
}

const LoggedIcon = ({ user }:{ user:any }) => {

  return (
    <div className='p-3 flex items-center space-x-5'>
      <IconButton
        onClick={() => {
          GET('/api/signout')
        }}
      >
        <LockOpenIcon />
      </IconButton>
      <div>
        {user.email}
      </div>
    </div>
  )
}

export default function SideBar() {
  const [open, setOpen] = React.useState(true);
  const [userInfo,setUserInfo] = React.useState<any>(); // TODO: type

  const router = useRouter();

  const toggleDrawer = () => {
    setOpen(!open);
  }

  const navigateToUpload = () => {
    router.push('/upload')
  }

  React.useEffect(() => {
    (async() => {
      const userInfo = await GET('/api/user')
      setUserInfo(userInfo.data)
    })()
  },[])

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
          userInfo?.isAuthenticated ? <LoggedIcon user={userInfo.user}/> : <UnLoggedIcon />
        }
        <Divider />
        <List>
          {['Search','About'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => {
                  text === 'Search' ? router.push('/') : router.push('/about')
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
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            {
              userInfo && userInfo.role === 'admin' ? 
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={navigateToUpload}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <UploadIcon />
                </ListItemIcon>
                <ListItemText primary='Upload' sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton> :
              null
            }
          </ListItem>
        </List>
      </Drawer>
  );
}
