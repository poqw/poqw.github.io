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
    <Typography className={classes.root} variant="h1" color="textPrimary">
      {children}
    </Typography>
  )
}

const useH2Styles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(8)
  }
}))

export const H2: React.FC = ({
  children
}) => {
  const classes = useH2Styles()
  return (
    <Typography className={classes.root} variant="h2" color="textPrimary">
      {children}
    </Typography>
  )
}

const useH3Styles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(4)
  }
}))

export const H3: React.FC = ({
  children
}) => {
  const classes = useH3Styles()
  return (
    <Typography className={classes.root} variant="h3" color="textPrimary">
      {children}
    </Typography>
  )
}

const useH4Styles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1.5)
  }
}))

export const H4: React.FC = ({
  children
}) => {
  const classes = useH4Styles()
  return (
    <Typography className={classes.root} variant="h4" color="textPrimary">
      {children}
    </Typography>
  )
}

const useH5Styles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1.5)
  }
}))

export const H5: React.FC = ({
  children
}) => {
  const classes = useH5Styles()
  return (
    <Typography className={classes.root} variant="h5" color="textPrimary">
      {children}
    </Typography>
  )
}

const useH6Styles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1.5)
  }
}))

export const H6: React.FC = ({
  children
}) => {
  const classes = useH6Styles()
  return (
    <Typography className={classes.root} variant="h6" color="textPrimary">
      {children}
    </Typography>
  )
}

const usePStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}))

export const P: React.FC = ({
  children
}) => {
  const classes = usePStyles()
  return (
    <Typography className={classes.root} variant="body1" color="textPrimary">
      {children}
    </Typography>
  )
}

const useOLStyles = makeStyles((theme) => ({
  root: {
    listStyle: 'none',
    counterReset: 'cupcake',
    '& li': {
      paddingBottom: theme.spacing(2),
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
      {children}
    </ol>
  )
}

const useULStyles = makeStyles((theme) => ({
  root: {
    '& li': {
      paddingBottom: theme.spacing(2)
    }
  }
}))

export const Ul: React.FC = ({
  children
}) => {
  const classes = useULStyles()
  return (
    <ul className={classes.root}>
      {children}
    </ul>
  )
}

export { default as Img } from '../Image'
