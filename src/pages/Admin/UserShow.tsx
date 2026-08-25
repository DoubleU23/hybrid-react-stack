import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { UserObject } from 'convex/schema'
import dayjs from 'dayjs'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router'
import PageContainer from '../../components/admin/PageContainer'
import { apiFetchUserByClerkId, deleteOne as deleteUser, getOne as getEmployee } from '../../data/users'
import { useDialogs } from '../../hooks/useDialogs/useDialogs'
import useNotifications from '../../hooks/useNotifications/useNotifications'

export default function UserShow() {
  const { userId } = useParams()
  const navigate = useNavigate()

  const dialogs = useDialogs()
  const notifications = useNotifications()

  const [user, setUser] = React.useState<UserObject | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  const loadData = React.useCallback(async () => {
    setError(null)
    setIsLoading(true)

    try {
      // const showData = await getEmployee(Number(employeeId))
      const user = await apiFetchUserByClerkId(userId || '')

      setUser(user)
    } catch (showDataError) {
      setError(showDataError as Error)
    }
    setIsLoading(false)
  }, [userId])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleUserEdit = React.useCallback(() => {
    navigate(`/admin/users/${userId}/edit`)
  }, [navigate, userId])

  const handleUserDelete = React.useCallback(async () => {
    if (!user) {
      return
    }

    const confirmed = await dialogs.confirm(`Do you wish to delete ${user.username}?`, {
      title: `Delete User?`,
      severity: 'error',
      okText: 'Delete',
      cancelText: 'Cancel',
    })

    if (confirmed) {
      setIsLoading(true)
      try {
        await deleteUser(Number(userId))

        navigate('/admin/users')

        notifications.show('User deleted successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        })
      } catch (deleteError) {
        notifications.show(`Failed to delete user. Reason:' ${(deleteError as Error).message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        })
      }
      setIsLoading(false)
    }
  }, [user, dialogs, userId, navigate, notifications])

  const handleBack = React.useCallback(() => {
    navigate('/admin/users')
  }, [navigate])

  const renderShow = React.useMemo(() => {
    if (isLoading) {
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
    }
    if (error) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity='error'>{error.message}</Alert>
        </Box>
      )
    }

    return user ? (
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>First Name</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                {user.first_name}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>Last Name</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                {user.last_name}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>Username</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                {user.username}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>Role</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                {user.role}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>Email</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                {user.email}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>Join date</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                {dayjs(user.created_at).format('MMMM D, YYYY')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Stack direction='row' spacing={2} sx={{ justifyContent: 'space-between' }}>
          <Button variant='contained' startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back
          </Button>
          <Stack direction='row' spacing={2}>
            <Button variant='contained' startIcon={<EditIcon />} onClick={handleUserEdit}>
              Edit
            </Button>
            <Button variant='contained' color='error' startIcon={<DeleteIcon />} onClick={handleUserDelete}>
              Delete
            </Button>
          </Stack>
        </Stack>
      </Box>
    ) : null
  }, [isLoading, error, user, handleBack, handleUserEdit, handleUserDelete])

  const pageTitle = `User`

  return (
    <PageContainer
      title={user?.username}
      breadcrumbs={[{ title: 'Users', path: '/admin/users' }, { title: `${user?.username}` }]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
    </PageContainer>
  )
}
