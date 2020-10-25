import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import React from 'react'

import { TilTemplateContentProps } from './TilTemplateContentProps'

const TilTemplateMobile: React.FC<TilTemplateContentProps> = ({
  header,
  post,
  sidebar
}) => (
  <Box bgcolor="white">
    {header}
    {sidebar}
    <Container maxWidth="xs">
      <Box px={4} py={10}>
        {post}
      </Box>
    </Container>
  </Box>
)

export default TilTemplateMobile
