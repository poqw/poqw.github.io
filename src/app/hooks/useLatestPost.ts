import { graphql, useStaticQuery } from 'gatsby'
import _ from 'lodash'

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
  return `/til/${path.split('.')[0]}`
}
