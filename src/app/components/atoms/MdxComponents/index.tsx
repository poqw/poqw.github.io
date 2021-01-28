import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React from 'react'

const useH1Styles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(4)
  }
}))

export const H1: React.FC = ({
  children
}) => {
  const classes = useH1Styles()
  return (
    <Typography className={classes.root} variant="h1" color="textSecondary">
      {children}
    </Typography>
  )
}

const useH2Styles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(6)
  }
}))

export const H2: React.FC = ({
  children
}) => {
  const classes = useH2Styles()
  return (
    <Typography className={classes.root} variant="h2" color="textSecondary">
      {children}
    </Typography>
  )
}

const useH3Styles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(4)
  }
}))

export const H3: React.FC = ({
  children
}) => {
  const classes = useH3Styles()
  return (
    <Typography className={classes.root} variant="h3" color="textSecondary">
      {children}
    </Typography>
  )
}

const useH4Styles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(3)
  }
}))

export const H4: React.FC = ({
  children
}) => {
  const classes = useH4Styles()
  return (
    <Typography className={classes.root} variant="h4" color="textSecondary">
      {children}
    </Typography>
  )
}

const useH5Styles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(1.5)
  }
}))

export const H5: React.FC = ({
  children
}) => {
  const classes = useH5Styles()
  return (
    <Typography className={classes.root} variant="h5" color="textSecondary">
      {children}
    </Typography>
  )
}

const useH6Styles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(1)
  }
}))

export const H6: React.FC = ({
  children
}) => {
  const classes = useH6Styles()
  return (
    <Typography className={classes.root} variant="h6" color="textSecondary">
      {children}
    </Typography>
  )
}

const usePStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  }
}))

export const P: React.FC = ({
  children
}) => {
  const classes = usePStyles()
  return (
    <Typography className={classes.root} variant="body1" color="textSecondary">
      {children}
    </Typography>
  )
}

const useOLStyles = makeStyles((theme) => ({
  root: {
    listStyle: 'none',
    marginTop: theme.spacing(0.5),
    counterReset: 'cupcake',
    '& li': {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      counterIncrement: 'cupcake'
    },
    '& li:before': {
      content: 'counters(cupcake, ".") ". "'
    }
  }
}))

export const Ol: React.FC = ({
  children
}) => {
  const classes = useOLStyles()
  return (
    <ol className={classes.root}>
      <Typography variant="body2" color="textSecondary">
        {children}
      </Typography>
    </ol>
  )
}

const useULStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(0.5),
    paddingTop: theme.spacing(0),
    '& li': {
      paddingBottom: theme.spacing(0.5)
    }
  }
}))

export const Ul: React.FC = ({
  children
}) => {
  const classes = useULStyles()
  return (
    <ul className={classes.root}>
      <Typography variant="body2" color="textSecondary">
        {children}
      </Typography>
    </ul>
  )
}

export { default as Img } from '../Image'
