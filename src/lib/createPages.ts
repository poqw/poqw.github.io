import path from 'path'

import { CreatePagesArgs } from 'gatsby'

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
      path: `/til/${node.slug}`,
      component: path.resolve(__dirname, '../app/pages/TilPage/index.tsx'),
      context: {
        body: node.body,
        toc: node.tableOfContents,
        name: postName
      }
    })
  })
}
