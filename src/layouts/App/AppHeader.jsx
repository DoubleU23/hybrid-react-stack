// import AppRoutes from "../../routes"
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import AdbIcon from '@mui/icons-material/Adb'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import  * as React from 'react'
import { NavLink } from 'react-router'

import AppRoutes from '../../routes'

// {AppLayoutRoutes.children.map(({ name, path }) => (
//     <NavLink key={`NavLinkTo${name}`} to={path} className={({ isActive }) => (isActive ? ' active' : '')}>
//     {name?.toUpperCase()}
//     </NavLink>
// ))}

const pages = ['Products', 'Pricing', 'Blog']
const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

export default function AppHeader() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  // const AppLayoutRoutes = AppRoutes[0].children[0]


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

const AppLayoutRoutes = AppRoutes[0].children[0].children

  return (
    <div id='appHeader'>
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {AppLayoutRoutes.map(page => (
                page.showInNav &&
                <MenuItem key={page.name.toLowerCase()} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>
                    <NavLink to={page.path} className={({ isActive }) => (isActive ? ' active' : '')}>{page.name}</NavLink>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {AppLayoutRoutes.map((page) => (
              page.showInNav &&
              <Button sx={{ textAlign: 'center' }}>
                 <NavLink to={page.path} className={({ isActive }) => (isActive ? ' active' : '')}>{page.name}</NavLink>
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Show
            fallback={
              <div>
                <Button
                key='login'
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', textAlign: 'center' }}
              >
                <NavLink to='/login' className={({ isActive }) => (isActive ? ' active' : '')}>
                  LOGIN
                </NavLink>
                </Button>
                <Button
                key='register'
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', textAlign: 'center' }}
              >
                <NavLink to='/register' className={({ isActive }) => (isActive ? ' active' : '')}>
                  Register
                </NavLink>
                </Button>
              </div>
            }
            when='signed-in'
          >
            <UserButton userProfileMode='navigation' and userProfileUrl='/profile'/>
          </Show>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </div>
  )
}
{
  /* <header id='appHeader'>
      <div id="logo">Header</div>
      <nav>
        <NavLink to='/' end className={({ isActive }) => (isActive ? ' active' : '')}>
          HOME
        </NavLink>
        <NavLink to='/abc' className={({ isActive }) => (isActive ? ' active' : '')}>
          ABC
        </NavLink>
        <div id='userNav'>
          <Show
            fallback={
              <div>
                <NavLink to='/login' className={({ isActive }) => (isActive ? ' active' : '')}>
                  LOGIN
                </NavLink>
                <NavLink to='/register' className={({ isActive }) => (isActive ? ' active' : '')}>
                  Register
                </NavLink>
              </div>
            }
            when='signed-in'
          >
            <UserButton userProfileMode='navigation' and userProfileUrl='/profile'/>
          </Show>
        </div>
      </nav>
    </header> */
}
