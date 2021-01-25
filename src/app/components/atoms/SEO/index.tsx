import React from 'react'
import { Helmet } from 'react-helmet'

import { useSiteMetadata } from '../../../hooks/useSiteMetadata'

export interface SEOPros {
  lang?: string
  meta?: []
  title?: string
  description?: string
}

// TODO(poqw): Maybe 'en' lang is better for SEO?
const SEO: React.FC<SEOPros> = ({ lang = 'ko', meta = [], title, description = '' }) => {
  const { description: siteDescription, title: siteTitle, author } = useSiteMetadata()
  const metaDescription = description || siteDescription

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title}
      titleTemplate={`%s | ${siteTitle}`}
      meta={[
        {
          name: 'description',
          content: metaDescription
        },
        {
          property: 'og:title',
          content: title
        },
        {
          property: 'og:description',
          content: metaDescription
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:creator',
          content: author
        },
        {
          name: 'twitter:title',
          content: title
        },
        {
          name: 'twitter:description',
          content: metaDescription
        }
      ].concat(meta)}
    />
  )
}

export default SEO
