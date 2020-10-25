import Box from '@material-ui/core/Box'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Link } from 'gatsby'
import React from 'react'

const useStyles = makeStyles({
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  }
})

const MainHeader: React.FC = () => {
  const classes = useStyles()

  return (
    <Box display="flex" alignItems="center" py={3}>
      <div className={classes.logo}>
        <Link to="/">
          PORTILOG
        </Link>
      </div>
    </Box>
  )
}

export default MainHeader
