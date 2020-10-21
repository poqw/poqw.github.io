import Box, { BoxProps } from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import _ from 'lodash'
import React from 'react'

import { useAllDirectories } from '../../../hooks/useAllDirectories'
import DirectoryList from '../DirectoryList'

const Sidebar: React.FC<BoxProps> = () => {
  const directories = useAllDirectories()

  return (
    <Box>
      <Divider />
      {
        _.map(directories.children, (directory) => {
          return (
            <div key={directory.name}>
              <DirectoryList directory={directory} />
              <Divider />
            </div>
          )
        })
      }
    </Box>
  )
}

export default Sidebar
