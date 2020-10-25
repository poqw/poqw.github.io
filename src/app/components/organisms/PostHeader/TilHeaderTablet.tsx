import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import React from 'react'

import { TilHeaderContentProps } from './TilHeaderContentProps'

const TilHeaderTablet: React.FC<TilHeaderContentProps> = ({
  logo,
  onMenuButtonClick
}) => {
  return (
    <AppBar>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="space-between" alignItems="center" py={1} pl={8} pr={7}>
          {logo}
          <IconButton onClick={onMenuButtonClick}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Container>
    </AppBar>
  )
}

export default TilHeaderTablet
