import React, { createRef, memo, useLayoutEffect } from 'react'

const src = 'https://utteranc.es/client.js'

export interface CommentSectionProps {
  repo: string
}

const CommentSection: React.FC<CommentSectionProps> = memo(({ repo }) => {
  const containerRef = createRef<HTMLDivElement>()

  useLayoutEffect(() => {
    const utterances = document.createElement('script')

    const attributes = {
      src,
      repo,
      'issue-term': 'pathname',
      label: 'comment',
      theme: 'github-light',
      crossOrigin: 'anonymous',
      async: 'true'
    }

    Object.entries(attributes).forEach(([key, value]) => {
      utterances.setAttribute(key, value)
    })

    containerRef?.current?.appendChild(utterances)
  }, [containerRef, repo])

  return <div ref={containerRef} />
})

CommentSection.displayName = 'Utterances'

export default CommentSection
