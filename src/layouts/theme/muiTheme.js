import {red} from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
import { dark } from '@clerk/ui/themes'

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
  ...dark
})

export default muiTheme