import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import React from 'react'

import Header from '../../../components/organisms/Header'

const SIDEBAR_SIZE = 256

const PostTemplateDesktop: React.FC = ({ children }) => (
  <Box position="relative">
    <Header sidebarWidth={SIDEBAR_SIZE} />
    <Box ml={SIDEBAR_SIZE / 8}>
      <Container>
        {children}
      </Container>
    </Box>
  </Box>
)

export default PostTemplateDesktop
