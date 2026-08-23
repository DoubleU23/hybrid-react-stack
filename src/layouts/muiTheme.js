import {red} from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

const muiTheme = createTheme({
   palette: {
    mode: 'dark',
  },
  colorSchemes: {
    dark: true,
  },
  status: {
    danger: red[500],
  },
})

export default muiTheme