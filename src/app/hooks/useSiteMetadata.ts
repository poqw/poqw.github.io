import { useStaticQuery, graphql } from 'gatsby'

export const useSiteMetadata = (): Record<string, string> => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            author
            title
            description
          }
        }
      }
    `
  )

  return site.siteMetadata
}
