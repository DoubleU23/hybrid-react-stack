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
import dayjs from 'dayjs'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router'
import PageContainer from '../../../components/admin/PageContainer'
import { useDialogs } from '../../../hooks/useDialogs/useDialogs'
import useNotifications from '../../../hooks/useNotifications/useNotifications'
import { api } from '@convex/api'
import { useQuery } from 'convex/react'

export default function UserShow() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const dialogs = useDialogs()
  const notifications = useNotifications()
  const user = useQuery(api.users.getUserByClerkUserId, { clerk_user_id: userId || "" })

  const handleUserEdit = React.useCallback(() => {
    navigate(`/admin/users/${userId}/edit`)
  }, [navigate, userId])


  console.log('user :>> ', user);
  // 2. Extracted user into dependency array via separate function reference safely
  // const handleUserDelete = React.useCallback(async (username: string) => {
  //   const confirmed = await dialogs.confirm(`Do you wish to delete ${username}?`, {
  //     title: `Delete User?`,
  //     severity: 'error',
  //     okText: 'Delete',
  //     cancelText: 'Cancel',
  //   })

  //   if (confirmed) {
  //     try {
  //       // Replace with your Convex delete mutation if applicable later!
  //       await deleteUser(Number(userId))

  //       notifications.show('User deleted successfully.', {
  //         severity: 'success',
  //         autoHideDuration: 3000,
  //       })
  //       navigate('/admin/users')
  //     } catch (deleteError) {
  //       notifications.show(`Failed to delete user. Reason: ${(deleteError as Error).message}`, {
  //         severity: 'error',
  //         autoHideDuration: 3000,
  //       })
  //     }
  //   }
  // }, [dialogs, userId, navigate, notifications])

  const handleBack = React.useCallback(() => {
    navigate('/admin/users')
  }, [navigate])

  // 3. Early loading return (Convex hasn't resolved yet)
  if (user === undefined) {
    return (
      <PageContainer title="Loading User..." breadcrumbs={[{ title: 'Users', path: '/admin/users' }]}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', m: 1 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

  // 5. Early return check if user profile wasn't found in array response
  if (!user) {
    return (
      <PageContainer title="User Not Found" breadcrumbs={[{ title: 'Users', path: '/admin/users' }]}>
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Alert severity='error'>Could not find a user profile matching this identifier.</Alert>
        </Box>
      </PageContainer>
    )
  }

  // 6. Complete Data safe render layout
  return (
    <PageContainer
      title={user.username}
      breadcrumbs={[{ title: 'Users', path: '/admin/users' }, { title: `${user.username}` }]}
    >
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
            {/* <Button variant='contained' color='error' startIcon={<DeleteIcon />} onClick={() => handleUserDelete(user.username)}>
              Delete
            </Button> */}
          </Stack>
        </Stack>
      </Box>
    </PageContainer>
  )
}
