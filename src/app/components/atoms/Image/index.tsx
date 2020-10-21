import makeStyles from '@material-ui/core/styles/makeStyles'
import Img, { GatsbyImageProps } from 'gatsby-image'
import { withPrefix } from 'gatsby-link'
import _ from 'lodash'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    padding: theme.spacing(1)
  },
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2)
  }
}))

interface ImageProps extends Omit<GatsbyImageProps, 'sizes'> {
  alt?: string
  sizes: string
  src: string
  srcSet: string[]
}

const Image: React.FC<ImageProps> = (props) => {
  const classes = useStyles()

  if (_.isEmpty(props.srcSet)) { // External linked image.
    return (
      <div className={classes.root}>
        <img className={classes.imageContainer} src={props.src} alt={props.alt} />
      </div>
    )
  }

  const gatsbyImageProps: GatsbyImageProps = {
    alt: props.alt,
    className: [props.className, classes.imageContainer].join(' '),
    style: props.style,
    title: props.title,
    loading: props.loading,
    fluid: {
      aspectRatio: 1,
      sizes: props.sizes,
      src: withPrefix(props.src),
      srcSet: _.map(props.srcSet, (src) => withPrefix(src)).join(',\n')
    }
  }

  return <Img { ...gatsbyImageProps } />
}

export default Image
