import Box from '@material-ui/core/Box'
import React from 'react'

import Logo from '../../atoms/Logo'

const MainHeader: React.FC = () => (
  <Box display="flex" alignItems="center" py={3}>
    <Logo />
  </Box>
)

export default MainHeader
