import Box from '@material-ui/core/Box'
import React from 'react'

import { TilTemplateContentProps } from './TilTemplateContentProps'

const SIDEBAR_WIDTH = 220
const TOC_WIDTH = 180

const TilTemplateDesktop: React.FC<TilTemplateContentProps> = ({
  logo,
  header,
  sidebar,
  post,
  toc
}) => (
  <Box bgcolor="white" display="flex" justifyContent="space-between">
    <Box bgcolor="rgba(20, 150, 120, 0.1)" flexGrow={1} />
    <Box width={SIDEBAR_WIDTH} bgcolor="rgba(20, 150, 120, 0.1)">
      <Box display="flex" justifyContent="center" my={4}>
        {logo}
      </Box>
      <Box position="sticky" top={0} pr={2}>
        {sidebar}
      </Box>
    </Box>
    <Box width={848} px={6}>
      <Box py={3}>
        {header}
      </Box>
      {post}
    </Box>
    <Box
      height="100%"
      width={TOC_WIDTH}
      position="sticky"
      top={0}
      pt={6}
      mt={12}
    >
      {toc}
    </Box>
    <Box flexGrow={1} />
  </Box>
)

export default TilTemplateDesktop
