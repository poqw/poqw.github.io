import Box from '@material-ui/core/Box'
import React from 'react'

import Header from '../../../components/organisms/Header'

const SIDEBAR_SIZE = 256

const PostTemplateTablet: React.FC = ({ children }) => (
  <Box position="relative">
    <Header sidebarWidth={SIDEBAR_SIZE} />
    {children}
  </Box>
)

export default PostTemplateTablet
