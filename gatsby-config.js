/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  siteMetadata: {
    title: 'PORTILOG',
    description: 'Portfolio + TIL(Today I learned) + Blog for me.',
    author: 'Hyungsun Song <hssongng@gmail.com>'
  },
  plugins: [
    // Local plugins.
    'gatsby-plugin-global-layout',

    // External plugins.
    'gatsby-plugin-material-ui',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/assets/images`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'tils',
        path: `${__dirname}/tils`
      }
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              tracedSVG: true,
              quality: 90,
              backgroundColor: 'transparent'
            }
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              prompt: {
                user: 'poqw',
                host: 'localhost',
                global: true
              }
            }
          }
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#aed581',
        theme_color: '#7da453',
        display: 'minimal-ui',
        icon: 'assets/images/gatsby-icon.png'
      }
    },
    {
      resolve: 'gatsby-plugin-create-client-paths',
      options: { prefixes: ['/til/*'] }
    }
  ]
}
