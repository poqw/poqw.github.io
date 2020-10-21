import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { Link } from 'gatsby'
import _ from 'lodash'
import React from 'react'

import { useSidebarDispatch, useSidebarState } from '../../../store/sidebarStore'

export interface Directory {
  displayName: string
  name: string
  children?: Directory[]
}

interface Props {
  directory: Directory
}

const DirectoryList: React.FC<Props> = ({ directory }) => {
  const sidebarState = useSidebarState()
  const sidebarDispatch = useSidebarDispatch()

  const renderNestedDirectories = (children, directoryDepth = 1): React.ReactNode => {
    return _.map(children, (child: Directory) => {
      if (_.isEmpty(child.children)) {
        return (
          <ListItem button component={Link} to={`/posts/${child.name}`} key={child.displayName}>
            <Box pl={directoryDepth * 2}>
              <Typography variant="caption">{child.displayName}</Typography>
            </Box>
          </ListItem>
        )
      }

      return (
        <div key={child.displayName}>
          <ListItem button onClick={() => {
            sidebarDispatch({
              type: 'ITEM_CLICKED',
              payload: { clickedItemName: child.displayName }
            })
          }}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Box pl={directoryDepth * 2}>
                <Typography variant="body2">{child.displayName}</Typography>
              </Box>
              {sidebarState[child.displayName] ? <ExpandLess /> : <ExpandMore />}
            </Box>
          </ListItem>
          <Collapse in={sidebarState[child.displayName]} timeout="auto" unmountOnExit>
            {renderNestedDirectories(child.children, directoryDepth + 1)}
          </Collapse>
        </div>
      )
    })
  }

  return (
    <List>
      <ListItem button onClick={() => {
        sidebarDispatch({
          type: 'ITEM_CLICKED',
          payload: { clickedItemName: directory.displayName }
        })
      }}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography variant="subtitle2">{directory.displayName}</Typography>
          {sidebarState[directory.displayName] ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </ListItem>
      <Collapse in={sidebarState[directory.displayName]} timeout="auto" unmountOnExit>
        {renderNestedDirectories(directory.children)}
      </Collapse>
    </List>
  )
}

export default DirectoryList
