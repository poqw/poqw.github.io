import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
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

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: theme.palette._dark[200],
    '& :hover': {
      fontWeight: 'bold'
    }
  },
  displayName: {
    color: theme.palette._dark[300]
  }
}))

const DirectoryList: React.FC<Props> = ({ directory }) => {
  const classes = useStyles()
  const sidebarState = useSidebarState()
  const sidebarDispatch = useSidebarDispatch()

  const renderNestedDirectories = (children, directoryDepth = 1): React.ReactNode => {
    return _.map(children, (child: Directory) => {
      if (_.isEmpty(child.children)) {
        return (
          <ListItem
            button component={Link}
            to={`/til/${child.name}`}
            key={child.displayName}
            className={classes.link}
          >
            <Box pl={directoryDepth}>
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
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              <Box pl={directoryDepth}>
                <Typography variant="body2" className={classes.displayName}>
                  {child.displayName}
                </Typography>
              </Box>
              {sidebarState[child.displayName]
                ? <ExpandLess fontSize="small" />
                : <ExpandMore color="action" fontSize="small" />}
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
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Typography variant="body1" className={classes.displayName}>
            {directory.displayName}
          </Typography>
          {sidebarState[directory.displayName]
            ? <ExpandLess color="action" fontSize="small" />
            : <ExpandMore color="action" fontSize="small" />}
        </Box>
      </ListItem>
      <Collapse in={sidebarState[directory.displayName]} timeout="auto" unmountOnExit>
        {renderNestedDirectories(directory.children)}
      </Collapse>
    </List>
  )
}

export default DirectoryList
