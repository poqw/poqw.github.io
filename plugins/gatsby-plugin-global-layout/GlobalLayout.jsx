import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import React from 'react'
import { Helmet } from 'react-helmet'

import theme from '../../src/app/theme'

const GlobalLayout = ({ children }) => {
  return (
    <React.Fragment>
      <Helmet>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
      </Helmet>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        {children}
      </ThemeProvider>
    </React.Fragment>
  )
}

export default GlobalLayout
