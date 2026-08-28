import { Show, UserButton } from '@clerk/react'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import LinkIcon from '@mui/icons-material/Link'
// import AdbIcon from '@mui/icons-material/Adb'
// import Avatar from '@mui/material/Avatar'
// import Tooltip from '@mui/material/Tooltip'
import MenuIcon from '@mui/icons-material/Menu'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { AppBar } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { type ElementType, type ReactElement, useState } from 'react'
import { NavLink } from 'react-router'

// {AppLayoutRoutes.children.map(({ name, path }) => (
//     <NavLink key={`NavLinkTo${name}`} to={path} className={({ isActive }) => (isActive ? ' active' : '')}>
//     {name?.toUpperCase()}
//     </NavLink>
// ))}

interface FooterPages {
  title: string
  path: string
  Icon: ElementType
}
const pages = [
  { title: 'Impressum', path: '/impressum', Icon: LinkIcon },
  { title: 'Instagram', path: 'https://www.instagram.com/team_mischkonsum/', Icon: AlternateEmailIcon },
  { title: 'Youtube', path: 'https://www.youtube.com/@team_mischkonsum', Icon: YouTubeIcon },
]
const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

export default function AppHeader() {
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  // const AppLayoutRoutes = AppRoutes[0].children[0]

  const handleOpenNavMenu = (event:any) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event:any) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <div id='appHeader'>
      <AppBar position='static' sx={{position:'absolute', bottom: 0}}>
        <Container maxWidth='xl' sx={{justifyItems:'center'}}>
          <Toolbar disableGutters>
            {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                {pages.map(({title, path, Icon}: FooterPages): ReactElement => (
                    <MenuItem key={title.toLowerCase()} onClick={handleCloseNavMenu}>
                      <Typography sx={{ textAlign: 'center' }}>
                        <NavLink to={path} className={({ isActive }) => (isActive ? ' active' : '')}>
                          <Icon /> {title}
                        </NavLink>
                      </Typography>
                    </MenuItem>
                  ),
                )}
              </Menu>
            </Box> */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
               {pages.map(({title, path, Icon}: FooterPages): ReactElement => (
                    <Button sx={{ textAlign: 'center' }} key={title.toLowerCase()}>
                      <Icon />
                      <NavLink to={path} className={({ isActive }) => (isActive ? ' active' : '')}>
                        {title}
                      </NavLink>
                    </Button>
                  ),
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  )
}
