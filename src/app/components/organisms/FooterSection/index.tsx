import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Link } from 'gatsby'
import React from 'react'

export const useStyles = makeStyles({
  copyright: {
    color: 'white',
    '& :hover': {
      color: 'white'
    }
  }
})

const FooterSection: React.FC = () => {
  const classes = useStyles()

  return (
    <Box height="5vh" display="flex" justifyContent="center" alignItems="center" color="white">
      <Link to="https://poqw.github.io" className={classes.copyright}>
        <Typography variant="caption">형선의 Portilog © 2020</Typography>
      </Link>
    </Box>
  )
}

export default FooterSection
