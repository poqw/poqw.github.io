import { createMuiTheme } from '@material-ui/core'
import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes'

import { overrides } from './overrides'
import { palette } from './palette'
import { typography } from './typography'

const theme = createMuiTheme({ overrides, palette, typography })

export default responsiveFontSizes(theme)
