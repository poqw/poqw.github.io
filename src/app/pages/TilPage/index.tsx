import { RouteComponentProps } from '@reach/router'
import { PageContext } from 'gatsby/internal'
import React from 'react'

import Logo from '../../components/atoms/Logo'
import SEO from '../../components/atoms/SEO'
import Post from '../../components/organisms/Post'
import TilHeader from '../../components/organisms/PostHeader'
import TableOfContents from '../../components/organisms/TableOfContents'
import TilSidebar from '../../components/organisms/TilSidebar'
import TilTemplate from './template'

interface Props extends RouteComponentProps {
  pageContext: PageContext
}

const TilPage: React.FC<Props> = ({ pageContext }) => {
  const { name, body, toc } = pageContext

  return (
    <>
      <SEO title={name} />
      <TilTemplate
        logo={<Logo />}
        header={<TilHeader logo={<Logo />} />}
        sidebar={<TilSidebar />}
        post={<Post body={body} name={name} />}
        toc={<TableOfContents items={toc.items} />}
      />
    </>
  )
}

export default TilPage
