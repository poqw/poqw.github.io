import { RouteComponentProps } from '@reach/router'
import { navigate } from 'gatsby'
import _ from 'lodash'
import React, { useMemo } from 'react'

import Logo from '../../components/atoms/Logo'
import SEO from '../../components/atoms/SEO'
import Post from '../../components/organisms/Post'
import TilHeader from '../../components/organisms/PostHeader'
import TableOfContents from '../../components/organisms/TableOfContents'
import TilSidebar from '../../components/organisms/TilSidebar'
import { useAllPosts } from '../../hooks/useAllPosts'
import TilTemplate from './template'

interface Props extends RouteComponentProps {
  postName?: string
}

const TilPage: React.FC<Props> = ({ postName }) => {
  const allPosts = useAllPosts()

  const { toc, body, name } = useMemo(() => {
    const post = _.find(allPosts, { name: postName })
    if (_.isNil(post)) {
      navigate('/')
    }

    return _.find(allPosts, { name: postName })
  }, [allPosts, postName])

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
