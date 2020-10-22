import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React from 'react'

import Header from '../../../components/organisms/Header'

const SIDEBAR_SIZE = 256

export const useStyles = makeStyles({
  root: {
    backgroundColor: '#F6F6F6'
  }
})

const PostTemplateDesktop: React.FC = ({ children }) => {
  const classes = useStyles()

  return (
    <Box>
      <Header sidebarWidth={SIDEBAR_SIZE} />
      <Box className={classes.root}>
        <Box ml={SIDEBAR_SIZE / 8}>
          <Container>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default PostTemplateDesktop
