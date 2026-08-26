import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import FilterListIcon from '@mui/icons-material/FilterList'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridEventListener,
  type GridPaginationModel,
  gridClasses,
} from '@mui/x-data-grid'
import * as React from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import type { UserObject } from '../../../../convex/schema'
import PageContainer from '../../../components/mui/PageContainer'
import { INITIAL_PAGE_SIZE } from '../../../constants'
import { useDialogs } from '../../../hooks/useDialogs/useDialogs'
import useNotifications from '../../../hooks/useNotifications/useNotifications'
import { useQuery } from 'convex/react'
import { api } from '@convex/api'

export default function UserList() {
  const navigate = useNavigate()
  const dialogs = useDialogs()
  const notifications = useNotifications()
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. Cleaned up state tracker layout: Global search parameters removed
  const [filterField, setFilterField] = React.useState(searchParams.get('filterField') || 'none')
  const [filterValue, setFilterValue] = React.useState(searchParams.get('filterValue') || '')
  const [debouncedFilterValue, setDebouncedFilterValue] = React.useState(filterValue)

  // Standard Pagination state tracker blocks
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : INITIAL_PAGE_SIZE,
  })

  const [cursorMap, setCursorMap] = React.useState<Record<number, string | null>>({ 0: null })

  // Single debounce handler monitoring typing pauses
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedFilterValue(filterValue), 350)
    return () => clearTimeout(handler)
  }, [filterValue])

  // Reset page pagination maps if the active column target or values change
  React.useEffect(() => {
    setCursorMap({ 0: null })
    setPaginationModel((prev) => ({ ...prev, page: 0 }))
  }, [filterField, debouncedFilterValue])

  const activeCursor = cursorMap[paginationModel.page] ?? null

  // Fetch paginated slices passing along your dynamic structural constraints
  const userList = useQuery(api.users.getUsersFiltered, {
    paginationOpts: {
      numItems: paginationModel.pageSize,
      cursor: activeCursor,
    },
    filterField: filterField !== 'none' ? filterField : undefined,
    filterValue: filterField !== 'none' && debouncedFilterValue ? debouncedFilterValue : undefined,
  })

  React.useEffect(() => {
    if (userList?.continueCursor) {
      const nextPage = paginationModel.page + 1
      setCursorMap((prev) => ({ ...prev, [nextPage]: userList.continueCursor }))
    }
  }, [userList, paginationModel.page])

  // Map values back to URL query parameter tracking keys
  React.useEffect(() => {
    const params: Record<string, string> = {
      page: paginationModel.page.toString(),
      pageSize: paginationModel.pageSize.toString(),
    }
    if (filterField !== 'none') {
      params.filterField = filterField
      if (debouncedFilterValue) params.filterValue = debouncedFilterValue
    }
    setSearchParams(params)
  }, [paginationModel, filterField, debouncedFilterValue, setSearchParams])

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    if (newModel.pageSize !== paginationModel.pageSize) {
      setCursorMap({ 0: null })
      newModel.page = 0
    }
    setPaginationModel(newModel)
  }

  const handleRefresh = React.useCallback(() => {
    setCursorMap({ 0: null })
    setPaginationModel((prev) => ({ ...prev, page: 0 }))
  }, [])

  const handleRowClick = React.useCallback<GridEventListener<'rowClick'>>(
    ({ row }) => { navigate(`/admin/users/${row.clerk_user_id}`) },
    [navigate],
  )

  const handleRowEdit = React.useCallback(
    (user: UserObject) => () => { navigate(`/admin/users/${user.clerk_user_id}/edit`) },
    [navigate],
  )


  // const handleRowDelete = React.useCallback(
  //   (user: UserObject) => async () => {
  //     const confirmed = await dialogs.confirm(`Do you wish to delete ${user.username}?`, {
  //       title: `Delete User?`, severity: 'error', okText: 'Delete', cancelText: 'Cancel'
  //     })
  //     if (confirmed) {
  //       try {
  //         await deleteUser(Number(user.clerk_user_id))
  //         notifications.show('User successfully removed.', { severity: 'success', autoHideDuration: 3000 })
  //         handleRefresh()
  //       } catch (e) {
  //         notifications.show(`Failed to delete. Error: ${(e as Error).message}`, { severity: 'error', autoHideDuration: 3000 })
  //       }
  //     }
  //   },
  //   [dialogs, notifications, handleRefresh],
  // )

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { field: 'clerk_user_id', headerName: 'ID' },
      { field: 'username', headerName: 'Username', width: 140 },
      { field: 'first_name', headerName: 'First Name' },
      { field: 'last_name', headerName: 'Last Name' },
      { field: 'email', headerName: 'Email', width: 140 },
      { field: 'role', headerName: 'Role' },
      {
        field: 'created_at',
        headerName: 'Join date',
        type: 'date',
        valueGetter: value => value && new Date(value),
        width: 140,
      },
      {
        field: 'actions',
        type: 'actions',
        flex: 1,
        align: 'right',
        getActions: ({ row }) => [
          <GridActionsCellItem key='edit-item' icon={<EditIcon />} label='Edit' onClick={handleRowEdit(row)} />,
          /* <GridActionsCellItem key='delete-item' icon={<DeleteIcon />} label='Delete' onClick={handleRowDelete(row)} />, */
        ],
      },
    ],
    [handleRowEdit, /* handleRowDelete */],
  )

  const pageTitle = 'Users'
  const resolvedRowCount = userList?.isDone
    ? (paginationModel.page * paginationModel.pageSize) + (userList?.page.length ?? 0)
    : -1

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[{ title: 'Admin', path: '/admin' }, { title: pageTitle }]}
      actions={
        <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title='Reload data' placement='right' enterDelay={1000}>
            <div>
              <IconButton size='small' aria-label='refresh' onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* ==========================================
            CLEAN, TARGETED COLUMN FILTER INTERFACE
           ========================================== */}
        <Stack direction="row" spacing={2} sx={{ mb: 1, width: '100%' }}>

          <TextField
            select
            size="small"
            label="Filter Column"
            value={filterField}
            onChange={(e) => {
              setFilterField(e.target.value);
              setFilterValue(''); // Clear input text when swapping columns
            }}
            sx={{ width: 180 }}
          >
            <MenuItem value="none">No Filter</MenuItem>
            <MenuItem value="role">Role</MenuItem>
            <MenuItem value="username">Username</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="first_name">First Name</MenuItem>
            <MenuItem value="last_name">Last Name</MenuItem>
          </TextField>

          {filterField !== 'none' && (
            <TextField
              variant="outlined"
              size="small"
              label="Filter value..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterListIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }
              }}
              sx={{ width: 250 }}
            />
          )}
        </Stack>

        <DataGrid
          rows={userList?.page ?? []}
          rowCount={resolvedRowCount}
          getRowId={row => row.clerk_user_id}
          columns={columns}
          pagination
          paginationMode='server'
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
          loading={userList === undefined}
          pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
          sx={{
            [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: { outline: 'transparent' },
            [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: { outline: 'none' },
            [`& .${gridClasses.row}:hover`]: { cursor: 'pointer' },
          }}
        />
      </Box>
    </PageContainer>
  )
}
