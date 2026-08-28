import { Show, UserButton } from '@clerk/react'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import LinkIcon from '@mui/icons-material/Link'
import MenuIcon from '@mui/icons-material/Menu'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Stack } from '@mui/material'
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

interface FooterLinks {
  title: string
  path: string
  Icon: ElementType
}

const pages = [
  { title: 'Impressum', path: '/impressum', Icon: LinkIcon },
  { title: 'Instagram', path: 'https://instagram.com', Icon: AlternateEmailIcon },
  { title: 'Youtube', path: 'https://youtube.com', Icon: YouTubeIcon },
]

export default function AppFooter() {
  return (
    <Box
      component='footer'
      id='appFooter'
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 1,

        // SWITCH TO FIXED TO LOCK IT REGARDLESS OF NESTED ELEMENTS
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 1100,
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ justifyContent: 'center', minHeight: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'center', alignItems: 'center' }}
            >
              {pages.map(
                ({ title, path, Icon }: FooterLinks): ReactElement => (
                  <Button
                    key={path}
                    sx={{
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Icon fontSize='small' />
                    <NavLink
                      to={path}
                      className={({ isActive }) => (isActive ? ' active' : '')}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {title}
                    </NavLink>
                  </Button>
                ),
              )}
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </Box>
  )
}
