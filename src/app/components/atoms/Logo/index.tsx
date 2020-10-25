import makeStyles from '@material-ui/core/styles/makeStyles'
import { Link } from 'gatsby'
import React from 'react'

const useStyles = makeStyles({
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  }
})

const Logo: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.logo}>
      <Link to="/">
        PORTILOG
      </Link>
    </div>
  )
}

export default Logo
