import { graphql, useStaticQuery } from 'gatsby'
import _ from 'lodash'

import { TIL_DIR_NAME } from './constants'

export const useLatestPostPath = (): string => {
  const { allFile } = useStaticQuery(graphql`
    {
      allFile(sort: {fields: modifiedTime, order: DESC}, limit: 1, filter: {extension: {glob: "(mdx|md)"}}) {
        edges {
          node {
            relativePath
          }
        }
      }
    }
  `)

  const path = (_.first(allFile.edges) as any).node.relativePath
  return `/${TIL_DIR_NAME}/${path.split('.')[0]}`
}
