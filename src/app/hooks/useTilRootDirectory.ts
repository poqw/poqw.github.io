import { graphql, useStaticQuery } from 'gatsby'
import _ from 'lodash'

import { Directory } from '../components/organisms/DirectoryList'
import { TIL_DIR_NAME } from './constants'

const toDisplayName = (name: string): string => (name.split('.')[0]).replace(/[_|-]/g, ' ')

const TIL_PREFIX = '/' + TIL_DIR_NAME

export const useTilRootDirectory = (): Directory => {
  const { allMdx } = useStaticQuery(graphql`
    {
      allMdx(sort: {fields: fileAbsolutePath}) {
        nodes {
          slug
        }
      }
    }
  `)
  const result: Directory = {
    displayName: 'root',
    path: TIL_PREFIX,
    children: []
  }
  const slugs = _.map(allMdx.nodes, (node) => node.slug)

  // TODO(poqw): Refactor this codes.
  _.forEach(slugs, (slug) => {
    let currentDir = result
    const dirs = slug.split('/')
    _.forEach(dirs, (dir, index: number) => {
      if (_.isNil(currentDir.children)) {
        throw new Error('Children of currentDir cannot be nil.')
      }

      if (index < dirs.length - 1) {
        const foundIndex = _.findIndex(currentDir.children, ['displayName', dir])
        if (foundIndex === -1) {
          const nextDir: Directory = {
            displayName: dir,
            path: `${TIL_PREFIX}/${dirs.slice(0, index + 1).join('/')}`,
            children: []
          }
          currentDir.children.push(nextDir)
          currentDir = nextDir
        } else {
          currentDir = currentDir.children[foundIndex]
        }
      } else {
        currentDir.children.push({
          displayName: toDisplayName(dir),
          path: `${TIL_PREFIX}/${slug}`
        })
      }
    })
  })

  return result
}
