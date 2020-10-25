import Box from '@material-ui/core/Box'
import React from 'react'

import PostHeader from '../../../components/organisms/PostHeader'

const SIDEBAR_SIZE = 256

const PostTemplateTablet: React.FC = ({ children }) => (
  <Box position="relative">
    <PostHeader sidebarWidth={SIDEBAR_SIZE} />
    {children}
  </Box>
)

export default PostTemplateTablet
