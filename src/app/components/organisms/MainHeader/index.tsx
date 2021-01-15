import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Link } from 'gatsby'
import React from 'react'

import LogoIcon from '../../../../../assets/images/logo.svg'
import { useLatestPostPath } from '../../../hooks/useLatestPost'

const useStyles = makeStyles((theme) => ({
  icon: {
    width: 48,
    height: 48,
    [theme.breakpoints.only('sm')]: {
      width: 36,
      height: 36
    },
    [theme.breakpoints.only('xs')]: {
      width: 32,
      height: 32
    }
  },
  logoText: {
    color: theme.palette._green['500'],
    borderColor: theme.palette._green['500'],
    [theme.breakpoints.only('xs')]: {
      fontSize: '0.9rem'
    }
  },
  tilButton: {
    color: theme.palette._green['500'],
    borderColor: theme.palette._green['500']
  }
}))

const MainHeader: React.FC = () => {
  const classes = useStyles()
  const latestPostPath = useLatestPostPath()

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" py={2}>
      <Link to="/">
        <Box display="flex" alignItems="center">
          <Box className={classes.icon}>
            <LogoIcon />
          </Box>
          <Typography className={classes.logoText} variant="button">happy-nut</Typography>
        </Box>
      </Link>
      <Link to={latestPostPath}>
        <Button variant="outlined" className={classes.tilButton}>
          <Typography variant="button" className={classes.logoText}>Today I Learned</Typography>
        </Button>
      </Link>
    </Box>
  )
}

export default MainHeader
