import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import makeStyles from '@material-ui/core/styles/makeStyles'
import FacebookIcon from '@material-ui/icons/Facebook'
import GitHubIcon from '@material-ui/icons/GitHub'
import InstagramIcon from '@material-ui/icons/Instagram'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import MailIcon from '@material-ui/icons/Mail'
import { graphql, useStaticQuery } from 'gatsby'
import Img from 'gatsby-image'
import React from 'react'
import { useSpring, animated } from 'react-spring'

export const useStyles = makeStyles((theme) => ({
  contentContainer: {
    [theme.breakpoints.only('xs')]: {
      margin: `0 ${theme.spacing(3)}px 0 ${theme.spacing(3)}px`
    }
  },
  title: {
    fontSize: '3rem',
    whiteSpace: 'pre-line',
    wordBreak: 'keep-all',
    fontWeight: 'bold',
    [theme.breakpoints.only('sm')]: {
      fontSize: '2.5rem'
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: '2rem'
    }
  },
  subtitle: {
    marginTop: theme.spacing(2),
    fontSize: '1.7rem',
    whiteSpace: 'pre-line',
    wordBreak: 'keep-all',
    fontWeight: 'bold',
    [theme.breakpoints.only('sm')]: {
      fontSize: '1.3rem',
      marginTop: theme.spacing(1)
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: '1rem',
      marginTop: theme.spacing(1)
    }
  },
  descriptionContainer: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(0)
    }
  },
  description: {
    marginTop: theme.spacing(1),
    whiteSpace: 'pre-line',
    wordBreak: 'keep-all',
    [theme.breakpoints.only('xs')]: {
      fontSize: '1.1rem',
      marginTop: theme.spacing(0)
    }
  },
  subDescription: {
    fontSize: '1rem',
    marginTop: theme.spacing(1),
    whiteSpace: 'pre-line',
    wordBreak: 'keep-all',
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(0)
    }
  },
  iconContainer: {
    marginTop: theme.spacing(6),
    [theme.breakpoints.only('sm')]: {
      marginTop: theme.spacing(4)
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(2)
    }
  },
  iconButton: {
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    boxSizing: 'border-box',
    borderRadius: theme.spacing(4.5),
    backgroundColor: 'white',
    border: '2px solid white',
    color: 'rgba(20, 150, 120)',
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
      backgroundColor: 'transparent',
      color: 'white'
    },
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(1),
      marginTop: theme.spacing(0),
      width: 48,
      height: 48
    }
  },
  profileContainer: {
    margin: theme.spacing(6),
    maxWidth: 700,
    maxHeight: 700,
    border: '17px solid white',
    willChange: 'transform',
    boxShadow: '0px 10px 30px -5px rgba(0, 0, 0, 0.3)',
    [theme.breakpoints.only('sm')]: {
      maxWidth: 550,
      maxHeight: 550,
      margin: theme.spacing(5)
    },
    [theme.breakpoints.only('xs')]: {
      maxWidth: 200,
      maxHeight: 200,
      margin: theme.spacing(3)
    }
  }
}))

const calc = (x, y): number[] => {
  return [-(y - window.innerHeight / 2) / 140, (x - window.innerWidth / 2) / 140, 1.05]
}

const trans = (x, y, s): string => {
  return `perspective(700px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
}

const AboutSection: React.FC = () => {
  const classes = useStyles()

  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 1, tension: 250, friction: 40 }
  }))

  const profileQuery = useStaticQuery(graphql`
    query {
      fileName: file(relativePath: { eq: "profile.jpeg" }) {
        childImageSharp {
          fluid(maxWidth: 700, maxHeight: 700) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <Box display="flex" height="90vh" alignItems="center" color="white">
      <Grid container alignItems="center">
        <Grid item xs={12} md={6}>
          <animated.div
            className={classes.profileContainer}
            onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
            onMouseLeave={() => set({ xys: [0, 0, 1] })}
            style={{
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              transform: props.xys.interpolate(trans)
            }}
          >
            <Img fluid={profileQuery.fileName.childImageSharp.fluid} />
          </animated.div>
        </Grid>
        <Grid item md={1}> </Grid>
        <Grid item xs={12} md={5}>
          <Box className={classes.contentContainer}>
            <Typography variant="h1" className={classes.title}>ABOUT ME</Typography>
            <Typography variant="h1" className={classes.subtitle}>
              소프트웨어 엔지니어로서 저는,
            </Typography>
            <Box className={classes.descriptionContainer}>
              <Box pt={2}>
                <Typography variant="h4" className={classes.description}>
                TDD로 개발하는 것을 선호합니다.
                </Typography>
                <Typography variant="body1" className={classes.subDescription}>
                - 그것이 깔끔한 코드를 만드는 가장 좋은 방법이라 믿기 때문입니다.
                </Typography>
              </Box>
              <Box pt={2}>
                <Typography variant="h4" className={classes.description}>
                Agile 개발 방법론의 철학을 따릅니다.
                </Typography>
                <Typography variant="body1" className={classes.subDescription}>
                - 정적인 기획보다 동적인 피드백이 프로젝트를 더 옳은 방향으로 이끈다고 생각하기 때문입니다.
                </Typography>
              </Box>
              <Box pt={2}>
                <Typography variant="h4" className={classes.description}>
                배움에 열정이 있는 팀을 갈망합니다.
                </Typography>
                <Typography variant="body1" className={classes.subDescription}>
                - 함께 성장하는 것이야말로 가장 큰 시너지라고 생각하기 때문입니다.
                </Typography>
              </Box>
            </Box>
            <Box className={classes.iconContainer}>
              <IconButton
                className={classes.iconButton}
                href="https://github.com/poqw"
                target="_blank"
                rel="noreferrer noopener"
              >
                <GitHubIcon fontSize="large" />
              </IconButton>
              <IconButton
                className={classes.iconButton}
                href="https://www.linkedin.com/in/poqw"
                target="_blank"
                rel="noreferrer noopener"
              >
                <LinkedInIcon fontSize="large" />
              </IconButton>
              <IconButton
                className={classes.iconButton}
                href="https://www.instagram.com/hssongng/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <InstagramIcon fontSize="large" />
              </IconButton>
              <IconButton
                className={classes.iconButton}
                href="https://www.facebook.com/hssongng"
                target="_blank"
                rel="noreferrer noopener"
              >
                <FacebookIcon fontSize="large" />
              </IconButton>
              <IconButton
                className={classes.iconButton}
                href="mailto:poqw.dev@gmail.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                <MailIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AboutSection
