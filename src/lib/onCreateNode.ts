import { createFilePath } from 'gatsby-source-filesystem'

export async function onCreateNode ({ node, getNode, actions }): Promise<void> {
  const { createNodeField } = actions

  if (node.internal.type === 'Mdx') {
    const slug = createFilePath({ node, getNode, basePath: 'pages' })
    createNodeField({
      node,
      name: 'slug',
      value: slug
    })
  }
}
