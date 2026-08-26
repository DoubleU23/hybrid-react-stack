import { useMemo, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/api";
import EditIcon from '@mui/icons-material/Edit'
import PlusIcon from '@mui/icons-material/AddBoxRounded'
// import PlusIcon from '@mui/icons-material/AddBox'
import CreateIcon from '@mui/icons-material/Create'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Box, CircularProgress, Tooltip, Grid, Stack, IconButton} from "@mui/material";
import PageContainer from "src/components/mui/PageContainer";
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridEventListener,
  type GridPaginationModel,
  gridClasses,
} from '@mui/x-data-grid'
import { useNavigate } from "react-router";
import { INITIAL_PAGE_SIZE } from "src/constants";

export default function ArticlesList(params:any) {
    const navigate = useNavigate()
    const articleList = useQuery(api.articles.getArticles)
    console.log('articleList :>> ', articleList);

    const handleRowClick = (article:any) => {
        navigate(`/admin/articles/${article._id}/show/`)
    }
    const handleRowEdit = useCallback(
        (article: any) => () => { navigate(`/admin/articles/${article._id}/edit`) },
        [navigate],
    )


const handleRefresh = () => {
    navigate('/admin/articles')
}
const handleCreateNew = () => {
    navigate('/admin/articles/create')
}

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: 'title', headerName: 'title' },
      { field: 'subtitle', headerName: 'Subtitle', width: 140 },
      { field: 'text', headerName: 'Text' },
      { field: 'author', headerName: 'Author' },
      { field: 'created_at', headerName: 'Created at', type: 'date', valueGetter: value => value && new Date(value), width: 140 },
      { field: 'img_url', headerName: 'IMG' },
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
    [articleList,/* handleRowEdit */, /* handleRowDelete */],
  )


    if (articleList === undefined) {
    return (
      <PageContainer title="Loading Articles..." breadcrumbs={[{ title: 'Users', path: '/admin/users' }]}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', m: 1 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

const resolvedRowCount = articleList.length
let i = 0;

  return (
    <PageContainer title="Articles" breadcrumbs={[{title: 'Dashboard', path: '/admin'}, {title: 'Articles', path: '/admin/articles'}]}
        actions={
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
              <Tooltip title='Create New' placement='right' enterDelay={1000}>
                    <IconButton size='small' aria-label='refresh' onClick={handleCreateNew}>
                        <PlusIcon  />
                    </IconButton>
              </Tooltip>
              <Tooltip title='Refresh' placement='right' enterDelay={1000}>
                  <IconButton size='small' aria-label='refresh' onClick={handleRefresh}>
                    <RefreshIcon />
                  </IconButton>
                  </Tooltip>
            </Stack>
          }
        >


        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', m: 1 }}>
            {/* <Stack direction="row" spacing={2} sx={{ mb: 1, width: '100%' }}></Stack> */}
            <DataGrid
                      rows={articleList}
                      rowCount={resolvedRowCount}
                      getRowId={row => row._id}
                      columns={columns}
                      /* pagination
                      paginationMode='server' */
                      /* paginationModel={paginationModel} */
                      /* onPaginationModelChange={handlePaginationModelChange} */
                      disableRowSelectionOnClick
                      onRowClick={({row}) =>handleRowClick(row)}
                      loading={articleList === undefined}
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
