import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { RouteComponentProps } from '@reach/router'
import { Link } from 'gatsby'
import { PageContext } from 'gatsby/internal'
import React from 'react'

import LogoIcon from '../../../../assets/images/logo.svg'
import SEO from '../../components/atoms/SEO'
import Post from '../../components/organisms/Post'
import TilHeader from '../../components/organisms/PostHeader'
import TableOfContents from '../../components/organisms/TableOfContents'
import TilSidebar from '../../components/organisms/TilSidebar'
import TilTemplate from './template'

const useStyles = makeStyles((theme) => ({
  logoText: {
    color: theme.palette._green['500']
  }
}))

interface Props extends RouteComponentProps {
  pageContext: PageContext
}

const TilPage: React.FC<Props> = ({ pageContext }) => {
  const { name, body, toc } = pageContext
  const classes = useStyles()

  return (
    <>
      <SEO title={name} />
      <TilTemplate
        logo={
          <Box>
            <Box width={120} height={120} component={Link} to="/">
              <LogoIcon />
            </Box>
            <Typography className={classes.logoText} variant="button">Today I Learned</Typography>
          </Box>
        }
        header={<TilHeader />}
        sidebar={<TilSidebar />}
        post={<Post body={body} name={name} />}
        toc={<TableOfContents items={toc.items} />}
      />
    </>
  )
}

export default TilPage
