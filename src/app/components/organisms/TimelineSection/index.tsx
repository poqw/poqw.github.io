import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React, { useEffect } from 'react'

export const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(15),
    fontSize: '4rem',
    whiteSpace: 'pre-line',
    wordBreak: 'keep-all',
    fontWeight: 'bold',
    [theme.breakpoints.only('sm')]: {
      fontSize: '3.5rem',
      marginBottom: theme.spacing(10)
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: '3rem',
      marginBottom: theme.spacing(5)
    }
  }
}))

const initTimeline = (source): void => {
  const options = {
    type: 'timeline',
    source,
    // eslint-disable-next-line @typescript-eslint/camelcase
    embed_id: 'timeline-embed',
    // eslint-disable-next-line @typescript-eslint/camelcase
    initial_zoom: 1,
    // eslint-disable-next-line @typescript-eslint/camelcase
    start_at_end: true
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // eslint-disable-next-line no-undef
  window.timeline = new TL.Timeline('timeline-embed', source, options)
}

const TimelineSection: React.FC = () => {
  const classes = useStyles()

  useEffect(() => {
    const fetchTimeline = async (): Promise<void> => {
      initTimeline(await require('./timeline/timeline.json'))
    }

    fetchTimeline()
  }, [])

  return (
    <Box
      height="80vh"
      display="flex"
      flexDirection="column"
      py={4}
      alignItems="center"
    >
      <Typography variant="h1" className={classes.title}>EXPERIENCE</Typography>
      <div id="timeline-embed" />
    </Box>
  )
}

export default TimelineSection

