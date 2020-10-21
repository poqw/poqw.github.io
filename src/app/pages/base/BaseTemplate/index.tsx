import React from 'react'

import { Desktop, Mobile, Tablet } from '../../../hoc/responsive'
import BaseTemplateDesktop from './BaseTemplateDesktop'
import BaseTemplateMobile from './BaseTemplateMobile'
import BaseTemplateTablet from './BaseTemplateTablet'

const BaseTemplate: React.FC = ({ children }) => {
  return (
    <>
      <Mobile>
        <BaseTemplateMobile>
          {children}
        </BaseTemplateMobile>
      </Mobile>
      <Tablet>
        <BaseTemplateTablet>
          {children}
        </BaseTemplateTablet>
      </Tablet>
      <Desktop>
        <BaseTemplateDesktop>
          {children}
        </BaseTemplateDesktop>
      </Desktop>
    </>
  )
}

export default BaseTemplate
