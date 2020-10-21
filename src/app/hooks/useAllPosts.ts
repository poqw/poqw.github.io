import { graphql, useStaticQuery } from 'gatsby'
import _ from 'lodash'

import { PostProps } from '../components/organisms/Post'
import { TIL_DIR_NAME } from './constants'

export const useAllPosts = (): PostProps[] => {
  const { allMdx } = useStaticQuery(graphql`
    {
      allMdx {
        nodes {
          fileAbsolutePath
          body
          tableOfContents
        }
      }
    }
  `)

  return _.map(
    allMdx.nodes,
    (node) => {
      const postPaths = node.fileAbsolutePath.split('/')
      const postName = postPaths[postPaths.length - 1].split('.')[0]
      return ({
        body: node.body,
        path: node.fileAbsolutePath.split(`${TIL_DIR_NAME}`)[1],
        name: postName,
        toc: node.tableOfContents
      })
    }
  )
}
