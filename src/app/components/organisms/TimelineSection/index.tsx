import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React, { useEffect } from 'react'

const TIMELINE_EMBED_ID = 'timeline-embed'

export const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(12),
    fontSize: '3rem',
    whiteSpace: 'pre-line',
    wordBreak: 'keep-all',
    fontWeight: 'bold',
    [theme.breakpoints.only('sm')]: {
      fontSize: '2.5rem',
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8)
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: '2rem',
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6)
    }
  },
  timelineContainer: {
    height: '70vh'
  }
}))

const initTimeline = (source): void => {
  const options = {
    source,
    // eslint-disable-next-line @typescript-eslint/camelcase
    initial_zoom: 1,
    // eslint-disable-next-line @typescript-eslint/camelcase
    start_at_end: true
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // eslint-disable-next-line no-undef
  window.timeline = new TL.Timeline(TIMELINE_EMBED_ID, source, options)
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
    <Box height="100vh">
      <Box display="flex" justifyContent="center">
        <Typography variant="h1" className={classes.title}>EXPERIENCE</Typography>
      </Box>
      <div className={classes.timelineContainer}>
        <div id={TIMELINE_EMBED_ID} />
      </div>
    </Box>
  )
}

export default TimelineSection

