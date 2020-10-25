import { Theme, Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Toolbar from '@material-ui/core/Toolbar'
import makeStyles from '@material-ui/core/styles/makeStyles'
import MenuIcon from '@material-ui/icons/Menu'
import { Link } from 'gatsby'
import React, { useCallback, useState } from 'react'

import Sidebar from '../Sidebar'
import { PostHeaderContentProps } from './PostHeaderContentProps'

const useStyles = makeStyles<Theme, { sidebarWidth: number }>({
  swipeableDrawer: {
    width: (props) => props.sidebarWidth
  }
})

const PostHeaderMobile: React.FC<PostHeaderContentProps> = ({ title, titleLinkPath, sidebarWidth }) => {
  const classes = useStyles({ sidebarWidth })
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer: React.ReactEventHandler = useCallback(() => {
    setDrawerOpen(!drawerOpen)
  }, [drawerOpen])

  return (
    <>
      <SwipeableDrawer
        anchor='left'
        open={drawerOpen}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        classes={{
          paper: classes.swipeableDrawer
        }}
      >
        <Sidebar />
      </SwipeableDrawer>
      <AppBar>
        <Toolbar disableGutters>
          <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Link to={titleLinkPath}>
                <Typography variant="h5" color="textPrimary">{title}</Typography>
              </Link>
              <IconButton onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default PostHeaderMobile
