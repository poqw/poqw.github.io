import React from 'react'

import { Desktop, Mobile, Tablet } from '../../../hoc/responsive'
import PostTemplateDesktop from './PostTemplateDesktop'
import PostTemplateMobile from './PostTemplateMobile'
import PostTemplateTablet from './PostTemplateTablet'

const PostTemplate: React.FC = ({ children }) => {
  return (
    <>
      <Mobile>
        <PostTemplateMobile>
          {children}
        </PostTemplateMobile>
      </Mobile>
      <Tablet>
        <PostTemplateTablet>
          {children}
        </PostTemplateTablet>
      </Tablet>
      <Desktop>
        <PostTemplateDesktop>
          {children}
        </PostTemplateDesktop>
      </Desktop>
    </>
  )
}

export default PostTemplate
