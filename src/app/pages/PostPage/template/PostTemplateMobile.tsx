import Box from '@material-ui/core/Box'
import React from 'react'

import PostHeader from '../../../components/organisms/PostHeader'

const SIDEBAR_SIZE = 224

const PostTemplateMobile: React.FC = ({ children }) => (
  <Box position="relative">
    <PostHeader sidebarWidth={SIDEBAR_SIZE} />
    {children}
  </Box>
)

export default PostTemplateMobile
