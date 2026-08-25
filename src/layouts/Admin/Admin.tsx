import { api } from '@convex/api'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import CssBaseline from '@mui/material/CssBaseline'
import { useTheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useConvexAuth, useQuery } from 'convex/react'
import * as React from 'react'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import DashboardHeader from '../../components/admin/DashboardHeader'
import DashboardSidebar from '../../components/admin/DashboardSidebar'
import SitemarkIcon from '../../components/admin/SitemarkIcon'
import {
  dataGridCustomizations,
  datePickersCustomizations,
  formInputCustomizations,
  sidebarCustomizations,
} from '../../components/mui'
import DialogsProvider from '../../hooks/useDialogs/DialogsProvider'
import NotificationsProvider from '../../hooks/useNotifications/NotificationsProvider'
import AppTheme from '../theme/admin/AdminTheme'

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
}

export default function Admin(props: any) {
  const navigate = useNavigate()
  const authState = useConvexAuth()

  // 1. Call the query at the top level
  const user = useQuery(api.users.getCurrentUser, authState.isAuthenticated ? undefined : 'skip')
  console.log('user :>> ', user)

  // 2. Safely trigger redirect when loading finishes and auth is missing
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      navigate('/')
    }
  }, [authState, navigate])

  const theme = useTheme()

  const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] = React.useState(true)
  const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] = React.useState(false)

  const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'))

  const isNavigationExpanded = isOverMdViewport ? isDesktopNavigationExpanded : isMobileNavigationExpanded

  const setIsNavigationExpanded = React.useCallback(
    (newExpanded: boolean) => {
      if (isOverMdViewport) {
        setIsDesktopNavigationExpanded(newExpanded)
      } else {
        setIsMobileNavigationExpanded(newExpanded)
      }
    },
    [isOverMdViewport, setIsDesktopNavigationExpanded, setIsMobileNavigationExpanded],
  )

  const handleToggleHeaderMenu = React.useCallback(
    (isExpanded: boolean) => {
      setIsNavigationExpanded(isExpanded)
    },
    [setIsNavigationExpanded],
  )

  const layoutRef = React.useRef<HTMLDivElement>(null)
  //   const { pathname } = useLocation()
  //  const boxPosition = pathname !== '/admin' ? "'position: 'relative'" : ""
  // CHECK ADMIN ROLE

  const renderOutletIfAdmin = () => {
    if (authState.isLoading || (authState.isAuthenticated && user === undefined)) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            m: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )
    } else if (user === null || user.role !== 'admin' || !authState.isAuthenticated) {
      return <p className='text-red-500 p-6 font-bold'>Access Denied: Admins only.</p>
    }

    return <Outlet />
  }

  return (
    <AppTheme themeComponents={themeComponents}>
      <NotificationsProvider>
        <DialogsProvider>
          <Box
            ref={layoutRef}
            sx={{
              position: 'relative',
              display: 'flex',
              overflow: 'hidden',
              height: '100%',
              width: '100%',
              minHeight: '100vh',
            }}
          >
            <DashboardHeader
              logo={<SitemarkIcon />}
              title=''
              menuOpen={isNavigationExpanded}
              onToggleMenu={handleToggleHeaderMenu}
            />
            <DashboardSidebar
              expanded={isNavigationExpanded}
              setExpanded={setIsNavigationExpanded}
              container={layoutRef?.current ?? undefined}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minWidth: 0,
              }}
            >
              <Toolbar sx={{ displayPrint: 'none' }} />
              <Box
                component='main'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  overflow: 'auto',
                }}
              >
                {renderOutletIfAdmin()}
              </Box>
            </Box>
          </Box>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  )
}
