import React from 'react'

import { Desktop, Mobile, Tablet } from '../../../hoc/responsive'
import { TilTemplateContentProps } from './TilTemplateContentProps'
import TilTemplateDesktop from './TilTemplateDesktop'
import TilTemplateMobile from './TilTemplateMobile'
import TilTemplateTablet from './TilTemplateTablet'

const TilTemplate: React.FC<TilTemplateContentProps> = (props) => (
  <>
    <Mobile>
      <TilTemplateMobile {...props} />
    </Mobile>
    <Tablet>
      <TilTemplateTablet {...props} />
    </Tablet>
    <Desktop>
      <TilTemplateDesktop {...props} />
    </Desktop>
  </>
)

export default TilTemplate
