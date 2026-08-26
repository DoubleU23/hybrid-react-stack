import PageContainer from "src/components/mui/PageContainer"
import Box from "@mui/material/Box"
export default function AdminHome(params) {

    return (
        <PageContainer title='Dashboard' breadcrumbs={[{ title: 'Admin', path: '/admin' }, { title: 'Dashboard' }]}>
        <Box sx={{ flex: 1, width: '100%' }}>
                    ADMIN HOME
        </Box>
        </PageContainer>
    )
}