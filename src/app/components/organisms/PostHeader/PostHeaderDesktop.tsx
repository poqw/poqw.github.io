import { Theme, Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Container from '@material-ui/core/Container'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Link } from 'gatsby'
import React from 'react'

import Sidebar from '../Sidebar'
import { PostHeaderContentProps } from './PostHeaderContentProps'

const useStyles = makeStyles<Theme, { sidebarWidth: number }>({
  appbar: {
    left: (props) => props.sidebarWidth,
    width: (props) => `calc(100% - ${props.sidebarWidth}px)`
  },
  drawer: {
    width: (props) => props.sidebarWidth
  }
})

const PostHeaderDesktop: React.FC<PostHeaderContentProps> = ({
  title,
  titleLinkPath,
  sidebarWidth
}) => {
  const classes = useStyles({ sidebarWidth })

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        classes={{
          paper: classes.drawer
        }}
      >
        <Sidebar />
      </Drawer>
      <AppBar className={classes.appbar}>
        <Toolbar disableGutters>
          <Container>
            <Link to={titleLinkPath}>
              <Typography variant="h3" color="textPrimary">{title}</Typography>
            </Link>
          </Container>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default PostHeaderDesktop
