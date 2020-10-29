import { graphql, useStaticQuery } from 'gatsby'
import _ from 'lodash'

import { TableOfContentsProps } from '../components/organisms/TableOfContents'

export interface TilProps {
  body: string
  name: string
  toc: TableOfContentsProps
}

export const useAllPosts = (): TilProps[] => {
  const { allMdx } = useStaticQuery(graphql`
    {
      allMdx {
        nodes {
          body
          tableOfContents
          slug
        }
      }
    }
  `)

  return _.map(
    allMdx.nodes,
    (node) => {
      const postPaths = node.slug.split('/')
      const postName = postPaths[postPaths.length - 1]

      return ({
        body: node.body,
        path: node.slug,
        name: postName,
        toc: node.tableOfContents
      })
    }
  )
}
