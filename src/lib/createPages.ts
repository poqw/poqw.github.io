import path from 'path'

import { CreatePagesArgs } from 'gatsby'

import { TIL_DIR_NAME } from '../app/hooks/constants'

export async function createPages ({ actions, graphql }: CreatePagesArgs): Promise<void> {
  const { createPage } = actions
  const { data, errors } = await graphql(`
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

  if (errors) {
    throw errors
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  data.allMdx.nodes.forEach((node) => {
    const postPaths = node.slug.split('/')
    const postName = postPaths[postPaths.length - 1]
    createPage({
      path: `/${TIL_DIR_NAME}/${node.slug}`,
      component: path.resolve(__dirname, '../app/pages/TilPage/index.tsx'),
      context: {
        body: node.body,
        toc: node.tableOfContents,
        name: postName
      }
    })
  })
}
