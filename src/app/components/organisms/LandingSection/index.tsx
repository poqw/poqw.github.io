import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React from 'react'
import { animated, useTransition } from 'react-spring'

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '4rem',
    whiteSpace: 'pre-line',
    wordBreak: 'keep-all',
    fontWeight: 'bold',
    willChange: 'transform, opacity',
    [theme.breakpoints.only('sm')]: {
      fontSize: '3rem'
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: '2rem'
    }
  },
  description: {
    marginTop: theme.spacing(2),
    fontSize: '1.5rem',
    whiteSpace: 'pre-line',
    wordBreak: 'keep-all',
    willChange: 'transform, opacity',
    [theme.breakpoints.only('sm')]: {
      fontSize: '1.2rem'
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: '1rem'
    }
  }
}))

const LandingSection: React.FC = () => {
  const classes = useStyles()
  const items = [
    {
      value: '반갑습니다.\n소프트웨어 장인을 꿈꾸는\n 개발자 송형선입니다.',
      className: classes.title
    },
    {
      value: '스크롤을 아래로 내려주세요.',
      className: classes.description
    }
  ]
  const transitions = useTransition(items, (item) => item.value, {
    from: {
      opacity: 0,
      transform: 'translate3d(0,-140px,0)'
    },
    enter: {
      opacity: 1,
      transform: 'translate3d(0,0px,0)'
    },
    leave: {
      opacity: 0,
      transform: 'translate3d(0,-100px,0)'
    }
  })

  return (
    <Box display="flex" alignItems="center" height="100vh">
      <Box>
        {transitions.map(({ item, props }, index) => (
          <animated.div key={index} style={props}>
            <Typography className={item.className}>{item.value}</Typography>
          </animated.div>
        ))}
      </Box>
    </Box>
  )
}

export default LandingSection
