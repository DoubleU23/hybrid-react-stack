import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridEventListener,
  type GridFilterModel,
  type GridPaginationModel,
  type GridSortModel,
  gridClasses,
} from '@mui/x-data-grid'
import * as React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import type { UserObject } from '../../../convex/schema'
import PageContainer from '../../components/admin/PageContainer'
import { INITIAL_PAGE_SIZE } from '../../constants'
import { apiFetchUsersPaginated, deleteOne as deleteEmployee } from '../../data/users' // getMany as getEmployees
import { useDialogs } from '../../hooks/useDialogs/useDialogs'
import useNotifications from '../../hooks/useNotifications/useNotifications'

export default function UserList() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const dialogs = useDialogs()
  const notifications = useNotifications()

  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : INITIAL_PAGE_SIZE,
  })
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>(
    searchParams.get('filter') ? JSON.parse(searchParams.get('filter') ?? '') : { items: [] },
  )
  const [sortModel, setSortModel] = React.useState<GridSortModel>(
    searchParams.get('sort') ? JSON.parse(searchParams.get('sort') ?? '') : [],
  )

  const [rowsState, setRowsState] = React.useState<{
    rows: UserObject[]
    rowCount: number
  }>({
    rows: [],
    rowCount: 0,
  })

  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  const handlePaginationModelChange = React.useCallback(
    (model: GridPaginationModel) => {
      setPaginationModel(model)

      searchParams.set('page', String(model.page))
      searchParams.set('pageSize', String(model.pageSize))

      const newSearchParamsString = searchParams.toString()

      navigate(`${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`)
    },
    [navigate, pathname, searchParams],
  )

  // const handleFilterModelChange = React.useCallback(
  //   (model: GridFilterModel) => {
  //     setFilterModel(model)

  //     if (model.items.length > 0 || (model.quickFilterValues && model.quickFilterValues.length > 0)) {
  //       searchParams.set('filter', JSON.stringify(model))
  //     } else {
  //       searchParams.delete('filter')
  //     }

  //     const newSearchParamsString = searchParams.toString()

  //     navigate(`${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`)
  //   },
  //   [navigate, pathname, searchParams],
  // )

  // const handleSortModelChange = React.useCallback(
  //   (model: GridSortModel) => {
  //     setSortModel(model)

  //     if (model.length > 0) {
  //       searchParams.set('sort', JSON.stringify(model))
  //     } else {
  //       searchParams.delete('sort')
  //     }

  //     const newSearchParamsString = searchParams.toString()

  //     navigate(`${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`)
  //   },
  //   [navigate, pathname, searchParams],
  // )

  const loadData = React.useCallback(async () => {
    setError(null)
    setIsLoading(true)

    try {
      const data = await apiFetchUsersPaginated() //apiGetUsers();
      // await getEmployees({
      //   paginationModel,
      //   sortModel,
      //   filterModel
      // })

      console.log('listData :>> ', data)
      setRowsState({
        rows: data.rows,
        rowCount: data.rows.length,
      })
    } catch (listDataError) {
      setError(listDataError as Error)
    }

    setIsLoading(false)
  }, [paginationModel, sortModel, filterModel])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) {
      loadData()
    }
  }, [isLoading, loadData])

  const handleRowClick = React.useCallback<GridEventListener<'rowClick'>>(
    ({ row }) => {
      navigate(`/admin/employees/${row.clerk_user_id}`)
    },
    [navigate],
  )

  const handleCreateClick = React.useCallback(() => {
    navigate('/admin/employees/new')
  }, [navigate])

  const handleRowEdit = React.useCallback(
    (user: UserObject) => () => {
      navigate(`/admin/users/${user.clerk_user_id}/edit`)
    },
    [navigate],
  )

  const handleRowDelete = React.useCallback(
    (user: UserObject) => async () => {
      const confirmed = await dialogs.confirm(`Do you wish to delete ${user.username}?`, {
        title: `Delete employee?`,
        severity: 'error',
        okText: 'Delete',
        cancelText: 'Cancel',
      })

      if (confirmed) {
        setIsLoading(true)
        try {
          await deleteEmployee(Number(user.clerk_user_id))

          notifications.show('Employee deleted successfully.', {
            severity: 'success',
            autoHideDuration: 3000,
          })
          loadData()
        } catch (deleteError) {
          notifications.show(`Failed to delete employee. Reason:' ${(deleteError as Error).message}`, {
            severity: 'error',
            autoHideDuration: 3000,
          })
        }
        setIsLoading(false)
      }
    },
    [dialogs, notifications, loadData],
  )

  const initialState = React.useMemo(
    () => ({
      pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
    }),
    [],
  )

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { field: 'clerk_user_id', headerName: 'ID' },
      { field: 'username', headerName: 'Username', width: 140 },
      { field: 'first_name', headerName: 'First Name' },
      { field: 'last_name', headerName: 'Last Name' },
      { field: 'email', headerName: 'Email', width: 140 },
      { field: 'role', headerName: 'Role', type: 'string' },
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
          <GridActionsCellItem key='delete-item' icon={<DeleteIcon />} label='Delete' onClick={handleRowDelete(row)} />,
        ],
      },
    ],
    [handleRowEdit, handleRowDelete],
  )

  const pageTitle = 'Users'

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
          {/*           <Button variant='contained' onClick={handleCreateClick} startIcon={<AddIcon />}>
            Create
          </Button> */}
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: '100%' }}>
        {error ? (
          <Box sx={{ flexGrow: 1 }}>
            <Alert severity='error'>{error.message}</Alert>
          </Box>
        ) : (
          <DataGrid
            rows={rowsState.rows}
            rowCount={rowsState.rowCount ?? 0}
            getRowId={row => row.clerk_user_id}
            columns={columns}
            pagination
            sortingMode='server'
            filterMode='server'
            paginationMode='server'
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            sortModel={sortModel}
            // onSortModelChange={handleSortModelChange}
            filterModel={filterModel}
            // onFilterModelChange={handleFilterModelChange}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            loading={isLoading}
            initialState={initialState}
            showToolbar
            pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: 'transparent',
              },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
                outline: 'none',
              },
              [`& .${gridClasses.row}:hover`]: {
                cursor: 'pointer',
              },
            }}
            slotProps={{
              loadingOverlay: {
                variant: 'circular-progress',
                noRowsVariant: 'circular-progress',
              },
              baseIconButton: {
                size: 'small',
              },
            }}
          />
        )}
      </Box>
    </PageContainer>
  )
}
