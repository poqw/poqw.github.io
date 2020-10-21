import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { MDXProvider } from '@mdx-js/react'
import AnchorJS from 'anchor-js'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import _ from 'lodash'
import React, { useEffect } from 'react'

import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/plugins/command-line/prism-command-line.css'
import './command-line.css'
import './custom-highlight.css'
import './custom-blockquote.css'
import './custom-image.css'
import './anchor.css'
import { H1, H2, H3, H4, H5, H6, Img, Ol, P, Ul } from '../../atoms/MdxComponents'
import SEO from '../../atoms/SEO'
import TableOfContents, { TableOfContentsProps } from '../TableOfContents'

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.up('md')]: {
      minWidth: theme.breakpoints.values.md,
      marginRight: '250px',
      paddingTop: theme.spacing(12),
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
      paddingBottom: theme.spacing(10),
      marginBottom: theme.spacing(10)
    },
    [theme.breakpoints.only('sm')]: {
      paddingTop: theme.spacing(11),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      paddingBottom: theme.spacing(8),
      marginBottom: theme.spacing(8)
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      marginBottom: theme.spacing(4)
    }
  },
  tocContainer: {
    position: 'fixed',
    width: '250px',
    paddingTop: theme.spacing(12),
    marginLeft: `${theme.breakpoints.values.md + 30}px`,
    [theme.breakpoints.only('sm')]: {
      display: 'none'
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  }
}))

const components = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  ul: Ul,
  ol: Ol,
  img: Img
}

export interface PostProps {
  // TODO(poqw): Use path to make hash tags.
  path?: string
  body: string
  name: string
  toc?: TableOfContentsProps
}

const Post: React.FC<PostProps> = ({ body, name, toc }) => {
  const classes = useStyles()

  useEffect(() => {
    // TODO(poqw): Use slug instead of anchoring directly.
    // TODO(poqw): Scroll softly: https://www.gatsbyjs.com/plugins/gatsby-plugin-anchor-links/
    const anchors = new AnchorJS()
    anchors.options.placement = 'left'
    anchors.add('#post h1, #post h2, #post h3, #post h4, #post h5, #post h6')
  })

  return (
    <>
      {!_.isNil(toc) &&
        <Box pl={2} className={classes.tocContainer}>
          <TableOfContents items={toc.items} />
        </Box>
      }
      <Paper id="post" className={classes.paper}>
        <SEO title={name} />
        <MDXProvider components={components}>
          <MDXRenderer>{body}</MDXRenderer>
        </MDXProvider>
      </Paper>
    </>
  )
}

export default Post
