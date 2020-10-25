import { graphql, useStaticQuery } from 'gatsby'
import _ from 'lodash'

import { Directory } from '../components/organisms/DirectoryList'
import { TIL_DIR_NAME } from './constants'

const toDisplayName = (name: string): string => (name.split('.')[0]).replace(/[_|-]/g, ' ')

export const useTilRootDirectory = (): Directory => {
  const { allMdx } = useStaticQuery(graphql`
    {
      allMdx(sort: {fields: fileAbsolutePath}) {
        nodes {
          fileAbsolutePath
        }
      }
    }
  `)
  const directories = _.compact(
    _.map(allMdx.nodes, (node) => node.fileAbsolutePath.split(`${TIL_DIR_NAME}/`)[1])
  )

  const result: Directory = {
    displayName: TIL_DIR_NAME,
    name: '/',
    children: []
  }

  // TODO(poqw): Refactor this codes.
  _.forEach(directories, (directory) => {
    let currentDir = result
    const dirs = directory.split('/')
    _.forEach(dirs, (dir, index: number) => {
      const name = dirs[dirs.length - 1].split('.')[0]
      if (index < dirs.length - 1) {
        const foundIndex = _.findIndex(currentDir.children, ['displayName', dir])
        if (foundIndex === -1) {
          const nextDir: Directory = {
            displayName: dir,
            name,
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
          name
        })
      }
    })
  })

  return result
}
