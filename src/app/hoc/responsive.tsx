import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import React from 'react'

export const Mobile: React.FC = ({ children }) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('xs'))

  return matches ? <>{children}</> : null
}

export const Tablet: React.FC = ({ children }) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  return matches ? <>{children}</> : null
}

export const Desktop: React.FC = ({ children }) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('lg'))

  return matches ? <>{children}</> : null
}
