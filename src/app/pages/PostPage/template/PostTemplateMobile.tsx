import Box from '@material-ui/core/Box'
import React from 'react'

import Header from '../../../components/organisms/Header'

const SIDEBAR_SIZE = 224

const PostTemplateMobile: React.FC = ({ children }) => (
  <Box position="relative">
    <Header sidebarWidth={SIDEBAR_SIZE} />
    {children}
  </Box>
)

export default PostTemplateMobile
