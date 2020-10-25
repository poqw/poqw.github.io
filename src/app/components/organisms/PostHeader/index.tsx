import React from 'react'

import { Desktop, Mobile, Tablet } from '../../../hoc/responsive'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import { PostHeaderContentProps } from './PostHeaderContentProps'
import PostHeaderDesktop from './PostHeaderDesktop'
import PostHeaderMobile from './PostHeaderMobile'
import PostHeaderTablet from './PostHeaderTablet'

interface Props {
  sidebarWidth: number
}

const PostHeader: React.FC<Props> = ({ sidebarWidth }) => {
  const { title } = useSiteMetadata()

  const props: PostHeaderContentProps = {
    title,
    titleLinkPath: '/',
    sidebarWidth
  }

  return (
    <>
      <Mobile>
        <PostHeaderMobile {...props} />
      </Mobile>
      <Tablet>
        <PostHeaderTablet {...props} />
      </Tablet>
      <Desktop>
        <PostHeaderDesktop {...props} />
      </Desktop>
    </>
  )
}

export default PostHeader
