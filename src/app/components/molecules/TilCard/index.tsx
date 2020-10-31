import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React from 'react'
import { animated, useSpring } from 'react-spring'

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '30%',
    cursor: 'pointer'
  },
  title: {
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    whiteSpace: 'pre-line',
    marginBottom: theme.spacing(2)
  },
  description: {
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    whiteSpace: 'pre-line',
    [theme.breakpoints.only('xs')]: {
      '-webkit-line-clamp': 1
    }
  },
  contentContainer: {
    width: '48%'
  },
  media: {
    width: '50%',
    clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)'
  }
}))

const calc = (x, y): number[] => {
  return [-(y - window.innerHeight / 2) / 20, (x - window.innerWidth / 2) / 20, 1.05]
}

const trans = (x, y, s): string => {
  return `perspective(600px) scale(${s})`
}

interface Props {
  title: string
  description: string
  mediaImg: string
}

const TilCard: React.FC<Props> = ({ title, description, mediaImg }) => {
  const classes = useStyles()
  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 1, tension: 400, friction: 4 }
  }))

  return (
    <animated.div
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      style={{ transform: props.xys.interpolate(trans) }}
    >
      <Card className={classes.root}>
        <Box display="flex" flexDirection="column" className={classes.contentContainer}>
          <CardContent>
            <Typography variant="h3" className={classes.title}>{title}</Typography>
            <div className={classes.description}>
              <Typography variant="body1" color="textSecondary">
                {description}
              </Typography>
            </div>
          </CardContent>
        </Box>
        <CardMedia
          className={classes.media}
          image={mediaImg}
          title={`media: ${title}`}
        />
      </Card>
    </animated.div>
  )
}

export default TilCard
