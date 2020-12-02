import Divider from '@material-ui/core/Divider'
import _ from 'lodash'
import React from 'react'

import DirectoryList from '../DirectoryList'
import { TilSidebarContentProps } from './TilSidebarContentProps'

const TilSidebarDesktop: React.FC<TilSidebarContentProps> = ({ directory }) => (
  <>
    {
      _.map(directory.children, (childDirectory) => {
        return (
          <div key={childDirectory.path}>
            <DirectoryList directory={childDirectory} />
            <Divider />
          </div>
        )
      })
    }
  </>
)

export default TilSidebarDesktop
